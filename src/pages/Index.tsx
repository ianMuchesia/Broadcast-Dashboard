
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { setPageTitle } from '../store/themeConfigSlice';
import { IRootState } from '../store';
import Dropdown from '../components/Dropdown';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import IconSettings from '../components/Icon/IconSettings';
import IconHelpCircle from '../components/Icon/IconHelpCircle';
import IconLogin from '../components/Icon/IconLogin';
import IconSearch from '../components/Icon/IconSearch';
import IconMessagesDot from '../components/Icon/IconMessagesDot';
import IconPhone from '../components/Icon/IconPhone';
import IconUserPlus from '../components/Icon/IconUserPlus';
import IconBell from '../components/Icon/IconBell';
import IconMenu from '../components/Icon/IconMenu';
import IconMessage from '../components/Icon/IconMessage';
import IconPhoneCall from '../components/Icon/IconPhoneCall';
import IconVideo from '../components/Icon/IconVideo';
import IconCopy from '../components/Icon/IconCopy';
import IconTrashLines from '../components/Icon/IconTrashLines';
import IconShare from '../components/Icon/IconShare';
import IconMoodSmile from '../components/Icon/IconMoodSmile';
import IconSend from '../components/Icon/IconSend';
import IconMicrophoneOff from '../components/Icon/IconMicrophoneOff';
import IconDownload from '../components/Icon/IconDownload';
import IconCamera from '../components/Icon/IconCamera';
import SummaryCards from '../components/SummaryCards';
import IconServer from '../components/Icon/IconServer';
import IconLayoutGrid from '../components/Icon/IconLayoutGrid';
import DeviceTypeDistribution from '../components/DeviceTypeDistribution';
import PanelDistribution from '../components/PanelDistribution';
import TopDeviceTypes from '../components/TopDeviceTypes';
import TopWorkstationPanels from '../components/TopWorkStationPanels';
import DeviceTypeCount from '../components/DeviceTypeCount';

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
            <div className="flex h-[400px] items-center justify-center">
                <div className="animate-spin border-2 border-primary border-t-transparent rounded-full h-12 w-12"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="bg-danger-light dark:bg-danger/20 text-danger p-4 rounded-md">{error}</div>
            </div>
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
