import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,  ResponsiveContainer } from 'recharts';
import { Bar, Doughnut } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SidBar from './sidbar';
import Nav from './nav'
import './adminhome.css';
import Chart from 'chart.js/auto'; // Import Chart.js library
const data = [
    { name: 'Sep', Revenue: 20, sales: 30 },
    { name: 'Oct', Revenue: 10, sales: 25 },
    { name: 'Nov', Revenue: 12, sales: 35 },
    { name: 'Dec', Revenue: 30, sales: 30 },
    { name: 'Jan', Revenue: 27, sales: 45 },
    { name: 'Feb', Revenue: 14, sales: 37 },
    { name: 'Mar', Revenue: 39, sales: 70 },
    { name: 'Apr', Revenue: 20, sales: 52 },
    { name: 'May', Revenue: 42, sales: 60 },
    { name: 'Jun', Revenue: 19, sales: 37 },
    { name: 'Jul', Revenue: 30, sales: 40 },
    { name: 'Aug', Revenue: 45, sales: 50 },
];
const date = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
];
const date1 = [
  { name: 'Page A', uv: 4000, pv: 4200, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 3700, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 3800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 7100, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 3000, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 1200, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 2900, amt: 2100 }
];

const date2 = [
  { name: 'Page A', uv: 4000, pv: 1800, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 3000, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 7000, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 2000, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4700, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 2500, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4200, amt: 2100 }
];

const date3 = [
  { name: 'Page A', uv: 4000, pv: 2000, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 5000, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 3200, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 9600, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 3600, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 2500, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 3900, amt: 2100 }
];

      
const popularProductsData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [
        {
            label: 'Ventes des produits populaires',
            data: [250, 180, 320, 280, 200], // Exemple de données de ventes des produits
            backgroundColor: '#45a', // Couleur de fond des barres
            borderColor: '#111861', // Couleur de bordure des barres
            borderWidth: 1
        },
    ],
};

const popularProductsOptions = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    stepSize: 50,
                    max: 350
                }
            }
        ]
    },
    legend: {
        display: false
    }
};
const abandonmentRateData = {
    labels: ['Achats Finalisés', 'Abandons de Panier'],
    datasets: [
        {
            label: 'Taux d\'Abandon de Panier',
            data: [70, 30], // Exemple de données pour les achats finalisés et les abandons de panier (en pourcentage)
            backgroundColor: [
                '#6699CC', // Couleur pour les achats finalisés
                '#111861;' // Couleur pour les abandons de panier
            ],
            borderWidth: 1
        },
    ],
};

const abandonmentRateOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Pourcentage de découpe du cercle intérieur
    legend: {
        display: true,
        position: 'bottom',
        labels: {
            fontSize: 12
        }
    }
};

const AdminHome = () => {
    const [chartInstance, setChartInstance] = useState(null);
    const [chartData, setChartData] = useState(popularProductsData);
    const canvasRef = useRef(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState('lastYear');

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };

    useEffect(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    }, [chartInstance]);

    const createChart = (data) => {
        const ctx = canvasRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: popularProductsOptions
        });
        setChartInstance(newChartInstance);
    };

    return (
        <div className='dashbord'>
            <SidBar />
              <div>
                <Nav/>
              
            <div className="dash">

      <div className="timeframeOptions">
        <button className={`timeframeOption ${selectedTimeframe === 'lastWeek' ? 'selected' : ''}`} onClick={() => handleTimeframeChange('lastWeek')}>Last week</button>
        <button className={`timeframeOption ${selectedTimeframe === 'lastMonth' ? 'selected' : ''}`} onClick={() => handleTimeframeChange('lastMonth')}>Last month</button>
        <button className={`timeframeOption ${selectedTimeframe === 'lastYear' ? 'selected' : ''}`} onClick={() => handleTimeframeChange('lastYear')}>Last year</button>
        <div className="selectorIndicator"></div>
      </div>
    <div style={{ display: 'flex' }}>
        <div className='graph-row'>
            <h2>Vente des produits populaires</h2>
            <Bar  data={popularProductsData} options={popularProductsOptions} />
        </div>
        <div style={{ display: 'flex', flex: 1 }}>
      <div style={{ flex: 1 }}>
        <div className="widget">
        <div className='graphee'>
          <LineChart className='graphee' width={100} height={70} data={date}>
            <Line type="monotone" dataKey="pv" stroke="#800080" strokeWidth={2} />
          </LineChart>
        </div>
        <div className='tote'>
          <p className='total'>total Views </p>
          <p className='totals'><TrendingUpIcon className='total1'/> 3.80%</p>
          <p className='totale'>52.34K</p>
        </div>
        </div>
        <div className="widget">
          <div className='graphee'>
              <LineChart className='graphee' width={100} height={70} data={date1}>
                <Line type="monotone" dataKey="pv" stroke="#FFD700" strokeWidth={2} />
              </LineChart>
          </div>    
          <div className='tote'>
              <p className='total'>total Profit </p>
              <p className='totals'><TrendingDownIcon className='total2'/>2.10%</p>
              <p className='totale'>12.34K</p>
          </div>
      </div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="widget">
        <div className='graphee'>
          <LineChart className='graphee' width={100} height={70} data={date2}>
            <Line type="monotone" dataKey="pv" stroke="	#B22222" strokeWidth={2} />
          </LineChart>
        </div>  
        <div className='tote'>
          <p className='total'>All Product </p>
          <p className='totals'><TrendingUpIcon className='total1'/>2.50%</p>
          <p className='totale'>32.34K</p>
        </div>
        </div>
        <div className="widget">
        <div className='graphee'>
          <LineChart className='graphee' width={100} height={70} data={date3}>
            <Line type="monotone" dataKey="pv" stroke="#FF6347" strokeWidth={2} />
          </LineChart>
        </div>  
        <div className='tote'>
          <p className='total'>total Users </p>
          <p className='totals'><TrendingUpIcon className='total1'/>7.60%</p>
          <p className='totale'>20.34K</p>
        </div>
        </div>
      </div>
    </div>
    </div>

<div style={{ display: 'flex' }}>
    <div className='graph' style={{ flex: 1 }}>
    <h2>Graphique des Ventes</h2>
        <LineChart width={550} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Revenue" stroke="#111861" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="sales" stroke="#ADD8E6" />
        </LineChart>
    </div>
        <div className='graphe' style={{  flex: 2 }}>
    <h2>Abandonment Rate</h2>
            <Doughnut data={abandonmentRateData} options={abandonmentRateOptions} />
        </div>
    </div>
  </div>
  </div>
  </div>
    );
};

export default AdminHome;
