import React from "react";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from "@mui/system";
import './savings.css';

const SavingCard = ({ name, saved, left, amount, percentage, color }) => {
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: 'var(--primary-sb-hover-color)',
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 10,
          backgroundColor: theme.palette.mode === 'light' ? color : {color},
        },
      }));

    return (
        <div className="saving-card">
            <div className="overlap">
                <div className="card-text">
                    <div className="overlap-group">
                        <div className="text-wrapper">{name}</div>
                        <div className="text-wrapper-2">$ {amount}</div>
                    </div>
                    <div className="text-wrapper-3">$ {saved} saved</div>
                    <div className="text-wrapper-4">$ {left} left</div>
                    </div>
                    <div className="text-wrapper-5">{percentage}%</div>
                    <BorderLinearProgress className="progress-bar" value={percentage} variant="determinate"/>
            </div>
        </div>
        );
    };

export default SavingCard;