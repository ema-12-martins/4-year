#include <zmq.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    // Inicialização do contexto ZMQ
    void *context = zmq_ctx_new();

    // Conexão com o publisher dos EUA (US)
    void *subscriber_us = zmq_socket(context, ZMQ_SUB);
    zmq_connect(subscriber_us, "tcp://localhost:5555");
    zmq_setsockopt(subscriber_us, ZMQ_SUBSCRIBE, "", 0); // Subscrição universal

    // Conexão com o publisher de Portugal (PT)
    void *subscriber_pt = zmq_socket(context, ZMQ_SUB);
    zmq_connect(subscriber_pt, "tcp://localhost:5556");
    zmq_setsockopt(subscriber_pt, ZMQ_SUBSCRIBE, "", 0); // Subscrição universal

    // Inicialização do poller
    zmq_pollitem_t items[] = {
        { subscriber_us, 0, ZMQ_POLLIN, 0 },
        { subscriber_pt, 0, ZMQ_POLLIN, 0 }
    };

    while (1) {
        // Espera por eventos nos dois sockets
        zmq_poll(items, 2, -1);

        // Verifica se há dados no socket dos EUA
        if (items[0].revents & ZMQ_POLLIN) {
            char buffer[256];
            zmq_recv(subscriber_us, buffer, 255, 0);
            buffer[255] = '\0'; // Garante terminação de string
            printf("Dados EUA: %s\n", buffer);
        }

        // Verifica se há dados no socket de Portugal
        if (items[1].revents & ZMQ_POLLIN) {
            char buffer[256];
            zmq_recv(subscriber_pt, buffer, 255, 0);
            buffer[255] = '\0'; // Garante terminação de string
            printf("Dados PT: %s\n", buffer);
        }
    }

    zmq_close(subscriber_us);
    zmq_close(subscriber_pt);
    zmq_ctx_destroy(context);
    return 0;
}
