#include <zmq.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    void *context = zmq_ctx_new();
    void *publisher = zmq_socket(context, ZMQ_PUB);
    zmq_connect(publisher, "tcp://localhost:5555");  // Conecta ao XSUB do proxy

    while (1) {
        char message[256];
        snprintf(message, sizeof(message), "TOPIC1 Mensagem do publisher");
        zmq_send(publisher, message, strlen(message), 0);
        printf("Publisher enviou: %s\n", message);
        sleep(1);
    }

    zmq_close(publisher);
    zmq_ctx_destroy(context);
    return 0;
}
