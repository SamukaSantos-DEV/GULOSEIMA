let barChart;



function filtrar() {
    const dia = document.getElementById('dia').value;
    const mes = document.getElementById('mes').value;
    const ano = document.getElementById('ano').value;
    const queryString = `dia=${dia}&mes=${mes}&ano=${ano}`;    
    fetch(`get_produtos_vendidos.php?${queryString}`)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.produto_nome);
            const valores = data.map(item => item.total_vendido);
            const barChartOptions = {
                series: [
                    {
                        data: valores,
                    },
                ],
                chart: {
                    type: 'bar',
                    horizontal: true,
                    scrolled: true,
                    toolbar: {
                        show: false,
                    },
                },
                colors: ['#246dec', '#cc3c43', '#367952', '#f5b74f', '#4f35a1'],
                plotOptions: {
                    bar: {
                        distributed: true,
                        borderRadius: 4,
                        horizontal: true,
                        columnWidth: '40%',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: false,
                },
                xaxis: {
                    categories: labels,
                },
                yaxis: {
                    title: {
                        text: 'Quantidade Vendida',
                    },
                },
            };

            if (barChart) {
                barChart.destroy();
            }

            barChart = new ApexCharts(
                document.querySelector('#bar-chart'),
                barChartOptions
            );
            barChart.render();
        })
        .catch(error => console.error('Erro:', error));
}

filtrar();
