import { Bar } from 'react-chartjs-2';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { th } from 'date-fns/locale';

export default function StockUsageChart({ data, dateRange }) {
  // Process data for the chart
  const processUsageData = () => {
    // Filter data by date range if provided
    const filteredData = data.filter(item => {
      if (!dateRange.startDate || !dateRange.endDate) return true;
      
      const itemDate = parseISO(item.created_at);
      const startDate = parseISO(dateRange.startDate);
      const endDate = parseISO(dateRange.endDate);
      
      return isWithinInterval(itemDate, { start: startDate, end: endDate });
    });

    // Group by item_name and sum quantities
    const usageByItem = filteredData.reduce((acc, item) => {
      if (!acc[item.item_name]) {
        acc[item.item_name] = {
          quantity: 0,
          totalPrice: 0,
          users: new Set()
        };
      }
      acc[item.item_name].quantity += item.quantity;
      // Calculate total price by multiplying quantity with price
      acc[item.item_name].totalPrice += (item.quantity * item.price);
      acc[item.item_name].users.add(item.user_name);
      return acc;
    }, {});

    return {
      labels: Object.keys(usageByItem),
      datasets: [
        {
          label: 'จำนวนการใช้งาน (ชิ้น)',
          data: Object.values(usageByItem).map(item => item.quantity),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'มูลค่าการใช้งาน (บาท)',
          data: Object.values(usageByItem).map(item => item.totalPrice),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'จำนวน (ชิ้น)',
          font: {
            family: 'Sarabun'
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'มูลค่า (บาท)',
          font: {
            family: 'Sarabun'
          }
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Sarabun'
          }
        }
      },
      title: {
        display: true,
        text: 'สถิติการใช้งานอะไหล่',
        font: {
          family: 'Sarabun',
          size: 16,
          weight: 'bold'
        }
      }
    }
  };

  return (
    <>
      <Bar data={processUsageData()} options={options} />
    </>
  );
}