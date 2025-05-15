import React from 'react'
import IconServer from './Icon/IconServer';
import IconLayoutGrid from './Icon/IconLayoutGrid';
import IconPhone from './Icon/IconPhone';
import IconMenu from './Icon/IconMenu';


interface SummaryCardsProps {
    deviceTotalCount: number;
    panelTotalCount: number;
    uniqueDeviceTypes: number;
    uniquePanelTypes: number;
}

const SummaryCards = ({ deviceTotalCount, panelTotalCount, uniqueDeviceTypes, uniquePanelTypes }: SummaryCardsProps) => {


     const cards = [
        {
            title: 'Total Devices',
            value: deviceTotalCount,
            icon: <IconServer className="w-6 h-6 text-primary" />,
            color: 'bg-primary/10 dark:bg-primary/20',
        },
        {
            title: 'Total Panels',
            value: panelTotalCount,
            icon: <IconLayoutGrid className="w-6 h-6 text-info" />,
            color: 'bg-info/10 dark:bg-info/20',
        },
        {
            title: 'Device Types',
            value: uniqueDeviceTypes,
            icon: <IconPhone className="w-6 h-6 text-success" />,
            color: 'bg-success/10 dark:bg-success/20',
        },
        {
            title: 'Panel Types',
            value: uniquePanelTypes,
            icon: <IconMenu className="w-6 h-6 text-warning" />,
            color: 'bg-warning/10 dark:bg-warning/20',
        },
    ];

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div key={index} className="panel">
                    <div className="flex items-center">
                        <div className={`rounded-md ${card.color} p-4 mr-4`}>
                            {card.icon}
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold dark:text-white-light">{card.value.toLocaleString()}</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
  )
}

export default SummaryCards