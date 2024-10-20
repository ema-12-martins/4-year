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

1. **Executando um único client e worker**
O cliente enviará mensagens, o broker distribuirá a tarefa para o worker, e o worker retornará uma resposta.
2. **Adicionando outro worker**
Agora o broker deve distribuir as tarefas entre os dois workers disponíveis. Você verá como as mensagens são processadas de forma balanceada.
3. **Reiniciando o broker**
Quando o broker é finalizado (killed), os workers e o client não conseguem mais trocar mensagens. Após o broker ser reiniciado, tanto os workers quanto o client tentarão se reconectar ao broker. Uma vez que a conexão é restabelecida, o fluxo de mensagens deve ser retomado sem que o cliente ou os workers precisem ser reiniciados.

4. **Emular partições de rede**
Ao criar uma partição de rede (desconectar ou desligar interfaces de rede), os clients e workers perderão temporariamente a conexão com o broker. Durante a partição, qualquer mensagem enviada pelo client ou qualquer tentativa de resposta de um worker não será entregue. Uma vez que a rede seja restaurada, tanto o client quanto os workers devem automaticamente tentar se reconectar ao broker. Quando a conectividade é restabelecida, as mensagens poderão fluir novamente normalmente.