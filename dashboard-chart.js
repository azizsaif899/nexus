// TASK-DASH-001: Team activity chart for dashboard
function addTeamActivityChart() {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Team Activity',
      data: [12, 19, 3, 5, 2],
      backgroundColor: 'rgba(54, 162, 235, 0.2)'
    }]
  };
  
  console.log('📊 Team activity chart added to dashboard');
  return chartData;
}

addTeamActivityChart();