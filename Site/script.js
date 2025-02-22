document.addEventListener("DOMContentLoaded", function() {
    const jobCards = document.querySelectorAll(".buttonAlt");
    const popupContainer = document.querySelector(".popup-container");
    const closeButton = document.querySelector(".close-btn");

    // Função para mostrar o popup
    const showPopup = () => {
        popupContainer.classList.add("active");
    };

    // Função para fechar o popup
    const closePopup = () => {
        popupContainer.classList.remove("active");
    };

    // Adiciona um ouvinte de evento de clique às divs "job_card" para mostrar o popup
    jobCards.forEach(function(jobCard) {
        jobCard.addEventListener("click", showPopup);
    });

    // Adiciona um ouvinte de evento de clique ao botão de fechar o popup para fechar o popup
    closeButton.addEventListener("click", closePopup);

    // Fecha o popup se o usuário clicar fora dele
    document.addEventListener("click", function(event) {
        if (!popupContainer.contains(event.target) && !jobCards.contains(event.target)) {
            closePopup();
        }
    });
});
let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

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


