// Configure o Firebase com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyA7R98AWNq1xeK-F5bQlXhp1y05sgT1dDU",
    authDomain: "projetogerenciamentodeponto.firebaseapp.com",
    databaseURL: "https://projetogerenciamentodeponto-default-rtdb.firebaseio.com",
    projectId: "projetogerenciamentodeponto",
    storageBucket: "projetogerenciamentodeponto.appspot.com",
    messagingSenderId: "357719476667",
    appId: "1:357719476667:web:b4c0f59234705ea7bb5c9e",
    measurementId: "G-6YQ1L5VL8M"
};

firebase.initializeApp(firebaseConfig);

// Obtém uma referência para o banco de dados Firebase
const database = firebase.database(); // Inicialize o banco de dados
const storage = firebase.storage(); // Inicialize o storage

// Função para enviar dados para o Firebase
function enviarDadosParaFirebase() {
    const nome = document.getElementById('nome').value;
    const entrada = document.getElementById('entrada').value;
    const saida = document.getElementById('saida').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de 
    imagem
    if (imagem) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    nome: nome,
                    entrada: entrada,
                    saida: saida,
                    imagemURL: downloadURL // Salva a URL da imagem
                };
                database.ref('funcionarios').push(dados)
                    .then(() => {
                        alert('Dados enviados com sucesso!');
                        document.getElementById('nome').value = '';
                        document.getElementById('entrada').value = '';
                        document.getElementById('saida').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch(error => {
                        console.error('Erro ao enviar os dados: ', error);
                    });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}

function consultarFuncionarioPorNome() {
    const nome = document.getElementById('nomeConsulta').value.trim();
    const funcionariosRef = database.ref('funcionarios');
    funcionariosRef.orderByChild('nome').equalTo(nome).once('value', snapshot => {
        const data = snapshot.val();
        const lista = document.getElementById('listaFuncionarios');
        lista.innerHTML = ''; // Limpar lista anterior
        if (data) {
            Object.keys(data).forEach(key => {
                const funcionario = data[key];
                const item = document.createElement('li');
                item.innerHTML = `Nome: ${funcionario.nome}, Entrada: ${funcionario.entrada}, Saida:${funcionario.saida}, 
                Imagem: <img src="${funcionario.imagemURL}" alt="Imagem do Funcionario" 
   style="width:100px; height:auto;">`;
                lista.appendChild(item);
            });
        } else {
            lista.innerHTML = '<li>Nenhum funcionario encontrado com esse nome.</li>';
        }
    }).catch(error => {
        console.error('Erro ao buscar funcionario: ', error);
    });
}