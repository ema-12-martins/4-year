#include <zmq.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    // Criação do contexto ZMQ
    void *context = zmq_ctx_new();

    // Socket para se conectar aos publishers (usando XSUB)
    void *xsub_socket = zmq_socket(context, ZMQ_XSUB);
    zmq_bind(xsub_socket, "tcp://*:5555");  // Porta de conexão para publishers

    // Socket para se conectar aos subscribers (usando XPUB)
    void *xpub_socket = zmq_socket(context, ZMQ_XPUB);
    zmq_bind(xpub_socket, "tcp://*:5556");  // Porta de conexão para subscribers

    zmq_pollitem_t items[] = {
        { xsub_socket, 0, ZMQ_POLLIN, 0 },
        { xpub_socket, 0, ZMQ_POLLIN, 0 }
    };

    // Loop para alternar mensagens entre os sockets XSUB e XPUB
    while (1) {
        zmq_poll(items, 2, -1);

        // Se uma mensagem chega do lado dos publishers
        if (items[0].revents & ZMQ_POLLIN) {
            zmq_msg_t message;
            zmq_msg_init(&message);
            zmq_msg_recv(&message, xsub_socket, 0);
            zmq_msg_send(&message, xpub_socket, 0);
            zmq_msg_close(&message);
        }

        // Se uma mensagem chega do lado dos subscribers (inscrição/desinscrição)
        if (items[1].revents & ZMQ_POLLIN) {
            zmq_msg_t message;
            zmq_msg_init(&message);
            zmq_msg_recv(&message, xpub_socket, 0);
            zmq_msg_send(&message, xsub_socket, 0);
            zmq_msg_close(&message);
        }
    }

    zmq_close(xsub_socket);
    zmq_close(xpub_socket);
    zmq_ctx_destroy(context);
    return 0;
}
