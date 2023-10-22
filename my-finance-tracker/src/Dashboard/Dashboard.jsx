import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, LinearProgress, Link, linearProgressClasses, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { BoxyRadialProgress } from '../Budgets/BoxyRadialProgress';
import { LineChart, Interpolation } from 'chartist';
import { getTransactions, getBudgets, getSavings, getSelectedBudgets, getSelectedSavings, getTransactionsByPages } from '../api';
import './dashboard.css';
import EditModeContext from '../editModeContext';

const SummaryCard = styled(Card)(({ theme }) => ({
  padding: '32px',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main,
  boxshadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

SummaryCard.defaultProps = {
  bgcolor: 'background.default',
  boxShadow: 3,
  m: 1,
  bordercolor: 'divider',
};

const StyledLink = styled(Link)(({ theme }) => ({
  color: "inherit",
  textDecoration: "underline",
  textDecorationColor: "#6a6a6a",
  "&:hover": {
    textDecorationColor: "var(--primary-button-color)"
  }
}));


const BorderLinearProgress = styled(LinearProgress)(({ customcolor }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'var(--primary-sb-hover-color)',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: customcolor,
  },
}));

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const placeholderBudgetCards = 4;
  const placeholderSavingCards = 2;
  const [data, setData] = useState([]);
  const minY = Math.min(...data.map(item => item.total));
  const maxY = Math.max(...data.map(item => item.total));
  const toCents = (amount) => Math.round(amount * 100);
  const toDollars = (cents) => (cents / 100).toFixed(2);
  const range = maxY - minY;
  const buffer = (0.20 * range);
  const { isBudgetsEditMode, setIsBudgetsEditMode, isSavingsEditMode, setIsSavingsEditMode } = useContext(EditModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTransactions = async () => {
      const allTransactions = await getTransactions();
      const chartData = createCumulativeData(allTransactions);
      setTransactions(allTransactions);
      setData(chartData);
    };

    const loadBudgets = async () => {
      const savedSelectedBudgets = await getSelectedBudgets();
      if (savedSelectedBudgets.results.length > 0) {
        setBudgets(savedSelectedBudgets.results);
      }
      else {
        const allBudgets = await getBudgets();
        setBudgets(allBudgets);
      }
    };

    const loadSavings = async () => {
      const savedSelectedSavings = await getSelectedSavings();
      if (savedSelectedSavings.results.length > 0) {
        setSavings(savedSelectedSavings.results);
      }
      else {
        const allSavings = await getSavings();
        setSavings(allSavings);
      }
    };

    loadTransactions();
    loadBudgets();
    loadSavings();
}, []);

useEffect(() => {
  if (data.length > 0) {
    const labels = data.map(item => item.day);
    const series = [data.map(item => item.total)];

    const chart = new LineChart('.ct-chart', {
      labels: labels,
      series: series
    }, {
      fullWidth: true,
      chartPadding: {
        left: -25,
        right: 60
      },
      high: maxY + buffer,
      low: minY - buffer,
      lineSmooth: Interpolation.simple(),
      showArea: true,
      axisX: {
        showGrid: false
      },
      axisY: {
        showGrid: false, 
        showLabel: false 
      },
  });
    chart.on('draw', function(data) {
      if(data.type === 'point' && data.index === data.series[data.series.length - 1].length - 1) {
        data.group.elem('circle', {
          cx: data.x,
          cy: data.y,
          r: 5
        }, 'ct-point').attr({
          'ct:value': data.y,
          'ct:meta': data.meta
        });
      }
      if (data.type === 'area') {
        const existingPath = data.element.attr('d');
        const modifiedPath = adjustPath(existingPath);
        data.element.attr({
          d: modifiedPath
        });
      }
    });
  }
}, [data]);

const adjustPath = (path) => {
  let commands = path.split(/(?=[MLCZ])/);  // Split by command letters

  // Find and adjust M command for x-axis
  let mIndex = commands.findIndex(cmd => cmd.startsWith('M'));
  if (mIndex !== -1) {
    let parts = commands[mIndex].split(',');
    parts[0] = 'M00';
    parts[1] = '500';
    commands[mIndex] = parts.join(',');
  }

  // Find and adjust the first L command for x-axis without changing its y axis
  let firstLIndex = commands.findIndex(cmd => cmd.startsWith('L'));
  if (firstLIndex !== -1) {
    let parts = commands[firstLIndex].split(',');
    parts[0] = 'L00';
    commands[firstLIndex] = parts.join(',');
  }

  // Extend the final L command to the bottom-most edge while maintaining its x axis
  let lastLIndex = commands.slice().reverse().findIndex(cmd => cmd.startsWith('L'));
  if (lastLIndex !== -1) {
    lastLIndex = commands.length - 1 - lastLIndex; // Convert from reverse index to regular index
    let parts = commands[lastLIndex].split(',');
    parts[1] = '700';
    commands[lastLIndex] = parts.join(',');
  }

  return commands.join(' ');
};

const totalIncomeCents = transactions
    .filter(transaction => transaction.type === 'inbound')
    .reduce((acc, transaction) => acc + toCents(parseFloat(transaction.amount)), 0);

const totalExpensesCents = transactions
    .filter(transaction => transaction.type === 'outbound')
    .reduce((acc, transaction) => acc + toCents(parseFloat(transaction.amount)), 0);

const totalBalanceCents = totalIncomeCents - totalExpensesCents;

// Convert them back to dollars for display:
const totalIncome = toDollars(totalIncomeCents);
const totalExpenses = toDollars(totalExpensesCents);
const totalBalance = toDollars(totalBalanceCents);

const getBalanceUntilDate = (transactions, endDate) => {
  return transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate <= endDate) {
      if (transaction.type === 'inbound') {
        return acc + parseFloat(transaction.amount);
      } else if (transaction.type === 'outbound') {
        return acc - parseFloat(transaction.amount);
      }
    }
    return acc;
  }, 0);
};

const formatDate = (date) => {
  const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
    "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
  ];
  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
};

const createCumulativeData = (transactions) => {
  const data = [];
  const today = new Date();
  const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);  // 30 days ago

  let balanceCents = toCents(getBalanceUntilDate(transactions, startDate));
  const interval = 10;

  for (let i = 0; i <= 30; i += interval) {
    const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);

    const dayTransactions = transactions.filter(transaction => {
      for (let j = 0; j < interval; j++) {
        const transactionDate = new Date(transaction.date);
        const comparedDay = new Date(startDate.getTime() + (i - j) * 24 * 60 * 60 * 1000);
        if (
          transactionDate.getDate() === comparedDay.getDate() &&
          transactionDate.getMonth() === comparedDay.getMonth() &&
          transactionDate.getFullYear() === comparedDay.getFullYear()
        ) {
          return true;
        }
      }
      return false;
    });

    // Adjust the balance based on the day's transactions
    dayTransactions.forEach(transaction => {
      if (transaction.type === 'inbound') {
        balanceCents += toCents(parseFloat(transaction.amount));
      } else if (transaction.type === 'outbound') {
        balanceCents -= toCents(parseFloat(transaction.amount));
      }
    });

    data.push({
      day: (i < 30) ? formatDate(day) : 'Today',
      total: parseFloat(toDollars(balanceCents))
    });
  }

  return data;
};

  const handleBudgetLink = (e) => {
    e.preventDefault();
    setIsBudgetsEditMode(true);
    navigate("/budgets");
  };

  const handleSavingLink = (e) => {
    e.preventDefault();
    setIsSavingsEditMode(true);
    navigate("/savings");
  };

  return (
    <div className="dashboard">
      <div className="title">Dashboard</div>
      <div className="div">
        <div className="overlap-group">
          <div className="text-wrapper">$ {totalBalance}</div>
          <div className="text-wrapper-2">$ {totalIncome}</div>
          <div className="text-wrapper-3">$ {totalExpenses}</div>
          <div className="text-wrapper-4">BALANCE</div>
          <div className="text-wrapper-5">EXPENSES</div>
          <div className="text-wrapper-6">INCOME</div>
          <img className="line" alt="Line" src="https://c.animaapp.com/KV7tg3cr/img/line-1.svg" />
          <img className="img" alt="Line" src="https://c.animaapp.com/KV7tg3cr/img/line-1.svg" />
          <img className="line-2" alt="Line" src="https://c.animaapp.com/KV7tg3cr/img/line-2.svg" />
        </div>
        <div className="transactions-div">
          <div className="transactions-text-wrapper">
            <div className="transactions-title">Recent Transactions</div>
            <div className="transactions-title-2"><StyledLink href="/transactions">See All</StyledLink></div>
          </div>
          <div className="transactions-box">
              <div className="transaction-headers">
                  <div className="text-wrapper-19">Description</div>
                  <div className="text-wrapper-20">Amount</div>
              </div>
              <img className="line-3" alt="Line" src="https://c.animaapp.com/beVmF1rD/img/line-4.svg" />
              {transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className={`group transaction-${index + 1}`}>
                      <div className="text-wrapper-21">{transaction.description}</div>
                      <div className={"text-wrapper-23"}>{transaction.type === 'outbound' ? `- $${transaction.amount}` : `+ $${transaction.amount}`}</div>
                  </div>
              ))}
          </div>
        </div>
        <div className="savings-div">
        <div className="savings-text-wrapper">
          <div className="savings-title">Savings</div>
          <div className="savings-title-2"><StyledLink onClick={(e) => handleSavingLink(e)} href="/savings">Manage</StyledLink></div>
        </div>
          <div className="savings-box">
            {savings && savings.length > 0 && savings.slice(0, 2).map((saving, index) => (
              <div key={index} className="small-saving-card">
                <div className="saving-name">{saving.name}</div>
                <div className="saving-amount">$ {saving.amount}</div>
                <div className="saving-percentage">{saving.percentage}%</div>
                <BorderLinearProgress className="progress-bar" value={saving.percentage} variant="determinate" customcolor={saving.color}/>
                </div>
            ))}
            {Array.from({ length: savings && savings.length > 0 && placeholderSavingCards - savings.length }).map((_, idx) => (
                <div key={idx} className="small-budget-card">
                  <div className="overlap-card"/>
                </div>
              ))}
          </div>
        </div>
          <div className="rectangle" >
            <div className="ct-chart"></div>
          </div>
        <div className="budget-div">
          <div className="text-wrapper-8">
            <div className="budgets-title">Budgets</div>
            <div className="budgets-title-2"><StyledLink onClick={(e) => handleBudgetLink(e)}>Manage</StyledLink></div>
          </div>
        <div className="budget-box">
          {budgets.slice(0, 4).map((budget, index) => (
            <div key={index} className="small-budget-card">
              <div className="overlap-card">
              <div className="card-text">
                <div className="card-name">{budget.name}</div>
                <div className="card-left">$ {budget.left} left</div>
                <div className="card-amount">$ {budget.amount}</div>
                <div className="card-percentage">{budget.percentage}%</div>
              </div>
              <div className="boxy-radial-bar">
                  <BoxyRadialProgress progress={budget.percentage} color={budget.color}/>
              </div>
            </div>
            </div>
          ))
          }
          {Array.from({ length: placeholderBudgetCards - budgets.length }).map((_, idx) => (
              <div key={idx} className="small-budget-card">
                <div className="overlap-card"/>
              </div>
            ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
