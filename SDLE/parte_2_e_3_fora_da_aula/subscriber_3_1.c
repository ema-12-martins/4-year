#include <zmq.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    void *context = zmq_ctx_new();
    void *subscriber = zmq_socket(context, ZMQ_SUB);
    zmq_connect(subscriber, "tcp://localhost:5556");  // Conecta ao XPUB do proxy

    // Inscrever-se em um tópico específico
    zmq_setsockopt(subscriber, ZMQ_SUBSCRIBE, "TOPIC1", 6);

    while (1) {
        char message[256];
        zmq_recv(subscriber, message, sizeof(message), 0);
        printf("Subscriber recebeu: %s\n", message);
    }

    zmq_close(subscriber);
    zmq_ctx_destroy(context);
    return 0;
}
