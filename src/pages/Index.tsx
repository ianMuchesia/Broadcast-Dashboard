
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import SummaryCards from '../components/SummaryCards';
import TopDeviceTypes from '../components/TopDeviceTypes';
import TopWorkstationPanels from '../components/TopWorkStationPanels';
import DeviceTypeCount from '../components/DeviceTypeCount';
import Loader from '../components/Loader';
import ErrorComponent from '../components/ErrorComponent';
import IconServer from '../components/Icon/IconServer';
import DeviceTypeDistribution from '../components/DeviceTypeDistribution';
import IconLayoutGrid from '../components/Icon/IconLayoutGrid';
import PanelDistribution from '../components/PanelDistribution';

interface InterviewData {
  deviceTypes: {
    totalCount: number;
    countByType: Record<string, number>;
  };
  panelsInWorkstations: {
    totalCount: number;
    workStationCountByPanel: Record<string, number>;
  };
}



const Index = () => {

    const dispatch = useDispatch();
    const [data, setData] = useState<InterviewData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


        useEffect(() => {
        dispatch(setPageTitle('System Dashboard'));
     const fetchData = async () => {
            try {
                const response = await fetch('/InterviewData.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                console.log('Fetched data:', jsonData);
                setData(jsonData);
                setIsLoading(false);
            } catch (err) {
                setError('Error loading dashboard data. Please try again later.');
                setIsLoading(false);
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [dispatch]);

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    if (error) {
        return (
          <ErrorComponent error={error} />
        );
    }

    if (!data) {
        return <div>No data available</div>;
    }



   
    return (
        <div>
              <SummaryCards 
                deviceTotalCount={data.deviceTypes.totalCount} 
                panelTotalCount={data.panelsInWorkstations.totalCount} 
                // object.keys returns an array of the keys of the object and then we get length
                uniqueDeviceTypes={Object.keys(data.deviceTypes.countByType).length}
                uniquePanelTypes={Object.keys(data.panelsInWorkstations.workStationCountByPanel).length}
            />
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Device Type Distribution</h5>
                        <IconServer className="w-5 h-5 text-primary" />
                    </div>
                    <DeviceTypeDistribution data={data.deviceTypes.countByType} />
                </div>
                
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Panel Distribution in Workstations</h5>
                        <IconLayoutGrid className="w-5 h-5 text-primary" />
                    </div>
                    <PanelDistribution data={data.panelsInWorkstations.workStationCountByPanel} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Top 10 Device Types</h5>
                    </div>
                    <TopDeviceTypes data={data.deviceTypes.countByType} />
                </div>
                
                <div className="panel">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Top 10 Workstation Panels</h5>
                    </div>
                    <TopWorkstationPanels data={data.panelsInWorkstations.workStationCountByPanel} />
                </div>
            </div>

            <div className="panel mb-6">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Detailed Device Count</h5>
                </div>
                <DeviceTypeCount data={data.deviceTypes.countByType} />
            </div>
           
        </div>
    );
};

export default Index;
