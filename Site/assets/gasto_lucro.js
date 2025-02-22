document.addEventListener("DOMContentLoaded", function() {
    let sidebarOpen = false;
    const sidebar = document.getElementById('sidebar');
    let areaChart = null;
    let isFetching = false;

    function openSidebar() {
        if (!sidebarOpen) {
            sidebar.classList.add('sidebar-responsive');
            sidebarOpen = true;
        }
    }

    function closeSidebar() {
        if (sidebarOpen) {
            sidebar.classList.remove('sidebar-responsive');
            sidebarOpen = false;
        }
    }

    const filtroMes = document.getElementById('filtro-mes');
    const filtroAno = document.getElementById('filtro-ano');
    const filtroDia = document.getElementById('filtro-dia');
    const filtroBtn = document.getElementById('filtro-btn');

    filtroBtn.addEventListener('click', function() {
        if (!isFetching) {
            fetchDados();
        }
    });

    function preencherMeses() {
        const meses = [
            { numero: '01', nome: 'Janeiro' },
            { numero: '02', nome: 'Fevereiro' },
            { numero: '03', nome: 'Março' },
            { numero: '04', nome: 'Abril' },
            { numero: '05', nome: 'Maio' },
            { numero: '06', nome: 'Junho' },
            { numero: '07', nome: 'Julho' },
            { numero: '08', nome: 'Agosto' },
            { numero: '09', nome: 'Setembro' },
            { numero: '10', nome: 'Outubro' },
            { numero: '11', nome: 'Novembro' },
            { numero: '12', nome: 'Dezembro' }
        ];

        meses.forEach(mes => {
            const option = document.createElement('option');
            option.value = mes.numero;
            option.textContent = mes.nome;
            filtroMes.appendChild(option);
        });
    }

    function preencherAnos() {
        const anoAtual = new Date().getFullYear();
        for (let ano = anoAtual; ano >= anoAtual - 10; ano--) {
            const option = document.createElement('option');
            option.value = ano.toString();
            option.textContent = ano.toString();
            filtroAno.appendChild(option);
        }
    }

    function preencherDias(mesSelecionado) {
        const diasNoMes = new Date(new Date().getFullYear(), mesSelecionado, 0).getDate();
        filtroDia.innerHTML = '<option value="">Todos</option>';
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const option = document.createElement('option');
            option.value = dia.toString().padStart(2, '0');
            option.textContent = dia.toString().padStart(2, '0');
            filtroDia.appendChild(option);
        }
    }

    filtroMes.addEventListener('change', function() {
        const mesSelecionado = filtroMes.value;
        preencherDias(mesSelecionado);
    });

    preencherMeses();
    preencherAnos();

    function fetchDados() {
        isFetching = true;
        const mes = filtroMes.value;
        const ano = filtroAno.value;
        const dia = filtroDia.value;

        let url = 'get_lucro_gastos.php';
        if (mes || ano || dia) {
            url += '?';
            if (mes) {
                url += `mes=${mes}&`;
            }
            if (ano) {
                url += `ano=${ano}&`;
            }
            if (dia) {
                url += `dia=${dia}&`;
            }
            url = url.slice(0, -1);
        }

        // Destruir o gráfico anterior se existir
        if (areaChart) {
            console.log('Destruindo gráfico existente');
            areaChart.destroy();
            areaChart = null;
            // Limpar manualmente o contêiner do gráfico
            document.querySelector('#area-chart').innerHTML = '';
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Dados recebidos', data);
                renderChart(data);
            })
            .catch(error => console.error('Erro:', error))
            .finally(() => isFetching = false);
    }

    function renderChart(data) {
        console.log('Renderizando novo gráfico');
        const labels = data.map(item => item.data_pedido);
        const lucro = data.map(item => item.total_lucro);
        const areaChartOptions = {
            series: [
                {
                    name: 'Saldo liquido',
                    data: lucro,
                },
            ],
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false,
                },
            },
            colors: ['#4f35a1', '#246dec'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                categories: labels,
            },
            yaxis: [
                {
                    title: {
                        text: 'Valores Mensais',
                    },
                },
            ],
            tooltip: {
                shared: true,
                intersect: false,
            },
        };
        areaChart = new ApexCharts(
            document.querySelector('#area-chart'),
            areaChartOptions
        );
        areaChart.render();
    }
    fetchDados();
});