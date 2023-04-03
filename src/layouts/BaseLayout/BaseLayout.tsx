import React from 'react';
import './BaseLayout.scss';
import { BaseLayoutHeader } from './BaseLayoutHeader/BaseLayoutHeader';

interface BaseLayoutProps {
    children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <div className="base-layout-container">
            <div className="base-layout-header-container">
                <BaseLayoutHeader />
            </div>
            <div className="base-layout-content-container">{children}</div>
        </div>
    );
};
