import React from 'react';
import { BoxyRadialProgress } from './BoxyRadialProgress';
import './budgets.css';

const BudgetCard = ({ name, startDate, endDate, spent, left, total, percentage, color }) => {
  
  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year.slice(-2)}/${month}/${day}`;
  };

  return (
    <div className="budget-card">
      <div className="overlap-group">
        <div className="card-text">
          <div className="text-wrapper">
            <span>{name}</span>
          </div>
          <div className="text-wrapper-4">$ {total}</div>
          <div className="text-wrapper-2">$ {spent} spent</div>
          <div className="text-wrapper-3">$ {left} left</div>
          <p className="p">{formatDate(startDate)} - {formatDate(endDate)}</p>
        </div>
        <div className="boxy-radial-bar">
          <BoxyRadialProgress progress={percentage} color={color} />
          <div className="text-wrapper-5">{percentage}%</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
