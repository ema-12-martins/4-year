# AULA 2

### 0MQ
O zmq_poll() permite que uma única thread monitore diversos sockets simultaneamente. Em vez de criar uma thread separada para cada socket (o que pode gerar complicações e custos de gerenciamento), o polling observa vários sockets de forma eficiente e responde a eventos conforme necessário.

A função zmq_poll() utiliza uma estrutura (zmq_pollitem_t) que define quais sockets devem ser monitorados e quais eventos estamos interessados em capturar, como:
- **ZMQ_POLLIN**: Sinaliza que há dados disponíveis para leitura no socket.
- **ZMQ_POLLOUT**: Indica que o socket está pronto para enviar dados.

No modelo de programação com zmq_poll(), você pode trabalhar com vários sockets, cada um lidando com diferentes tipos de mensagens ou conexões, sem precisar sair do loop principal da aplicação.

~~~c
zmq_pollitem_t items[] = {
    { socket1, 0, ZMQ_POLLIN, 0 },
    { socket2, 0, ZMQ_POLLIN, 0 }
};

// Monitora os dois sockets até que haja dados em pelo menos um deles
int rc = zmq_poll(items, 2, -1);

if (items[0].revents & ZMQ_POLLIN) {
    // socket1 tem dados para leitura
}

if (items[1].revents & ZMQ_POLLIN) {
    // socket2 tem dados para leitura
}
~~~

---

### Shared Queue pattern
O padrão Shared Queue com sockets DEALER e ROUTER no ZeroMQ é uma forma de implementar uma fila de trabalho distribuída, onde o broker (enfileirador) distribui tarefas para diferentes workers. O broker utiliza o socket ROUTER para gerenciar as mensagens tanto dos clients quanto dos workers, enquanto os clients e workers utilizam o socket DEALER para se comunicar com o broker.

Arquitetura:
1. **Broker**: Distribui as mensagens recebidas dos clients para os workers disponíveis.
2. **Client**: Envia mensagens para o broker, que redireciona para os workers.
3. **Worker**: Recebe mensagens do broker e processa as tarefas.

O broker usa um socket ROUTER tanto para os clientes quanto para os workers. Ele age como intermediário, recebendo mensagens dos clientes e distribuindo para os workers disponíveis.

ZMQ_DEALER distribui as mensagens para os workers automaticamente em um esquema de round-robin, enviando a próxima mensagem para o próximo worker disponível na lista de conexões.

1. **Executando um único client e worker**
O cliente enviará mensagens, o broker distribuirá a tarefa para o worker, e o worker retornará uma resposta.
2. **Adicionando outro worker**
Agora o broker deve distribuir as tarefas entre os dois workers disponíveis. Você verá como as mensagens são processadas de forma balanceada.
3. **Reiniciando o broker**
Quando o broker é finalizado (killed), os workers e o client não conseguem mais trocar mensagens. Após o broker ser reiniciado, tanto os workers quanto o client tentarão se reconectar ao broker. Uma vez que a conexão é restabelecida, o fluxo de mensagens deve ser retomado sem que o cliente ou os workers precisem ser reiniciados.

4. **Emular partições de rede**
Ao criar uma partição de rede (desconectar ou desligar interfaces de rede), os clients e workers perderão temporariamente a conexão com o broker. Durante a partição, qualquer mensagem enviada pelo client ou qualquer tentativa de resposta de um worker não será entregue. Uma vez que a rede seja restaurada, tanto o client quanto os workers devem automaticamente tentar se reconectar ao broker. Quando a conectividade é restabelecida, as mensagens poderão fluir novamente normalmente.

# Aula 3

### Proxy
A implementação de um proxy usando sockets XSUB e XPUB resolve o problema de "descoberta dinâmica" ao permitir que clientes se inscrevam em tópicos que são publicados por um número desconhecido e variável de publishers (publicadores). Isso é útil quando você tem múltiplos publicadores e quer que os subscribers (assinantes) recebam todas as mensagens relevantes, independentemente de quantos publicadores existam ou se novos publicadores forem adicionados/removidos.

Em sistemas de publish-subscribe (pub/sub), os publishers enviam mensagens sobre tópicos específicos, e os subscribers recebem essas mensagens com base nos tópicos em que estão inscritos. O desafio surge quando temos:
- Um número desconhecido ou variável de publishers.
- Subscribers que precisam receber dados de todos os publishers relevantes, sem precisar saber quantos publishers existem ou onde eles estão.

O proxy resolve esse problema ao atuar como um intermediário que conecta vários publishers a vários subscribers, sem que os publishers e subscribers precisem estar cientes uns dos outros.

**XPUB (Extended PUB)**: É um socket especial que permite que o proxy receba informações dos subscribers sobre quais tópicos eles estão interessados (por meio de "inscrições" ou "unsubscrições"). Normalmente, em um socket PUB normal, o publisher só envia mensagens e não recebe feedback sobre os interesses dos subscribers. Com XPUB, o proxy recebe esse feedback.

**XSUB (Extended SUB)**: É um socket que permite ao proxy enviar inscrições (subscriptions) ou desinscrições para publishers com base nos interesses dos subscribers conectados a ele. Ou seja, o proxy repassa as inscrições que recebe dos subscribers para os publishers conectados.

O proxy se posiciona entre os publishers e os subscribers:
- Do lado dos publishers, o proxy usa um socket XSUB para receber as mensagens publicadas.
- Do lado dos subscribers, o proxy usa um socket XPUB para enviar as mensagens recebidas dos publishers.

Subscribers se conectam ao proxy e informam quais tópicos querem seguir. O proxy, por sua vez, repassa essas informações de inscrição (ou desinscrição) para os publishers através do socket XSUB.

Publishers publicam mensagens para o proxy, que distribui essas mensagens para os subscribers que expressaram interesse nos tópicos correspondentes.

**1. Adaptar o Broker do Padrão de Fila Compartilhada**
O proxy deve ser capaz de aceitar inscrições de múltiplos subscribers e enviar mensagens de múltiplos publishers. O fluxo de mensagens entre publishers, o proxy e subscribers deve funcionar sem problemas, permitindo que os subscribers recebam mensagens sobre os tópicos em que estão inscritos.

**2. Adaptar o Publisher de Atualizações Meteorológicas**
O publisher deve ser capaz de enviar mensagens de diferentes tópicos (por exemplo, atualizações meteorológicas para diferentes regiões). As mensagens devem ser enviadas para o proxy, que então encaminha essas mensagens para os subscribers que estão interessados.

**3. Adaptar o Subscriber de Atualizações Meteorológicas**
O subscriber deve se inscrever em tópicos específicos (por exemplo, códigos postais de diferentes regiões).
O subscriber deve receber atualizações de acordo com suas inscrições.

**4. Matar e Reiniciar o Proxy**
Quando o proxy é finalizado (killed), os subscribers e publishers não poderão mais se comunicar. Após o proxy ser reiniciado, tanto os subscribers quanto os publishers devem tentar se reconectar automaticamente ao proxy. Uma vez que a conexão é restabelecida, o fluxo de mensagens deve ser retomado sem a necessidade de reiniciar os clients ou publishers. O comportamento do ZeroMQ em relação a falhas temporárias é robusto, permitindo que os clients e servers continuem tentando se reconectar.

**5. Emular Partições de Rede**
Ao emular uma partição de rede (por exemplo, desconectando uma interface de rede), os subscribers perderão a conexão com o proxy. As mensagens enviadas pelos publishers não serão entregues aos subscribers durante a partição de rede. Quando a rede for restaurada, os subscribers e publishers tentarão se reconectar ao proxy. Uma vez que a conectividade é restabelecida, os subscribers devem começar a receber as mensagens novamente.

---

### PUSH/PULL ZMQ-Sockets with the Divide and Conquer
O padrão "Divide and Conquer" é um método de resolução de problemas que envolve dividir um problema em subproblemas menores, resolvê-los separadamente e, em seguida, combinar as soluções. Em um contexto de computação, isso frequentemente se traduz em dividir uma carga de trabalho entre múltiplos processos ou threads.

Uso de PUSH/PULL com ZeroMQ:
- **PUSH**: Um socket que envia mensagens para múltiplos PULL sockets. Ele distribui as mensagens de forma balanceada entre todos os sockets PULL conectados.
- **PULL**: Um socket que recebe mensagens de múltiplos PUSH sockets. Ele coleta mensagens enviadas por sockets PUSH.

Estrutura do Código:
- **Master**: Envia tarefas (divisão do trabalho) para os workers usando um socket PUSH.
- **Workers**: Recebem as tarefas usando um socket PULL e processam-nas.

Código do Master (Divide):
~~~c
#include <zmq.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define NUM_WORKERS 4

int main(void) {
    void *context = zmq_ctx_new();
    void *push_socket = zmq_socket(context, ZMQ_PUSH);
    zmq_bind(push_socket, "tcp://*:5555");  // Porta para receber as tarefas

    // Envia 100 tarefas
    for (int i = 0; i < 100; i++) {
        char task[10];
        snprintf(task, sizeof(task), "Task %d", i);
        zmq_send(push_socket, task, strlen(task), 0);
        printf("Master sent: %s\n", task);
    }

    // Envia uma mensagem de fim de tarefa para cada worker
    for (int i = 0; i < NUM_WORKERS; i++) {
        zmq_send(push_socket, "", 0, 0);  // Enviar uma mensagem vazia para indicar fim
    }

    zmq_close(push_socket);
    zmq_ctx_destroy(context);
    return 0;
}
~~~

Código do Worker (Conquer):
~~~c
#include <zmq.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(void) {
    void *context = zmq_ctx_new();
    void *pull_socket = zmq_socket(context, ZMQ_PULL);
    zmq_connect(pull_socket, "tcp://localhost:5555");  // Conectar ao master

    while (1) {
        char task[10];
        zmq_recv(pull_socket, task, sizeof(task), 0);
        
        // Verifica se a mensagem está vazia (indica fim)
        if (strlen(task) == 0) {
            break;  // Sai do loop se receber uma mensagem vazia
        }

        // Processa a tarefa recebida
        printf("Worker received: %s\n", task);
        sleep(1);  // Simulando algum trabalho
    }

    zmq_close(pull_socket);
    zmq_ctx_destroy(context);
    return 0;
}
~~~

No contexto de sistemas distribuídos, o padrão "Divide and Conquer" pode ser implementado usando sockets PUSH e PULL do ZeroMQ. O socket PUSH é utilizado por um componente central (o "master") para distribuir tarefas a múltiplos workers, que são sockets PULL. Cada worker recebe uma parte da carga de trabalho e a processa simultaneamente. Essa abordagem não só aumenta a eficiência do processamento, mas também permite que o sistema escale facilmente, já que novos workers podem ser adicionados ou removidos conforme necessário, adaptando-se à carga de trabalho dinâmica e melhorando o desempenho geral do sistema.

O socket PUSH é usado por um componente que produz ou distribui tarefas, geralmente chamado de master. Ele envia mensagens (tarefas) para múltiplos sockets PULL conectados a ele. A principal característica do socket PUSH é que ele distribui as mensagens de forma balanceada entre todos os sockets PULL conectados. Isso significa que, se houver vários workers conectados, o PUSH enviará as mensagens a eles em uma ordem round-robin (circular), garantindo que a carga de trabalho seja distribuída de maneira equitativa.

Exemplo: Em um sistema onde o master precisa enviar 100 tarefas a vários workers, o master utilizará um socket PUSH para enviar essas tarefas. À medida que o master envia as mensagens, cada worker conectado ao socket PUSH receberá uma parte das tarefas, permitindo que todos trabalhem em paralelo.

O socket PULL é usado por um ou mais componentes que consomem ou processam as mensagens enviadas pelos sockets PUSH, geralmente chamados de workers. Cada worker se conecta ao socket PUSH e aguarda receber mensagens. O socket PULL recebe as mensagens de forma que cada worker processa uma tarefa por vez, retirando-a da fila de mensagens.

Exemplo: Cada worker conectado a um socket PUSH usará um socket PULL para receber tarefas. Quando um worker está pronto para processar uma nova tarefa, ele faz uma chamada para receber uma mensagem do socket PULL. O worker então processa a tarefa e, em seguida, pode repetir esse processo até que todas as tarefas sejam concluídas. Se houver múltiplos workers, cada worker pode processar tarefas simultaneamente, aumentando a eficiência do sistema.

1. O master utiliza um socket PUSH para distribuir tarefas a múltiplos workers.
2. Cada worker usa um socket PULL para receber essas tarefas e processá-las.
3. O PUSH garante que as mensagens sejam distribuídas de maneira balanceada entre os workers, enquanto o PULL permite que os workers retirem e processem as mensagens de forma eficiente.

Exemplo:
Suponha que você tenha um diretório contendo milhares de imagens que precisam ser processadas. Em vez de processar cada imagem sequencialmente em um único processo (o que seria ineficiente), você pode dividir o trabalho entre vários processos utilizando o padrão "Divide and Conquer".
1. Master (Servidor de Distribuição): O master usa um socket PUSH para distribuir as imagens para vários workers. Ele lê a lista de imagens do diretório e envia o nome de cada imagem como uma tarefa para os workers.

2. Workers (Processadores de Imagens): Cada worker usa um socket PULL para receber os nomes das imagens do master. Quando um worker recebe o nome de uma imagem, ele aplica o filtro desejado e salva a imagem processada em um diretório separado.