//  Hello World client (simplified with zhelpers.h)
#include <zmq.h>
#include <stdio.h>
#include "zhelpers.h"

int main (void)
{
    printf("Connecting to hello world server...\n");
    void *context = zmq_ctx_new();
    void *requester = zmq_socket(context, ZMQ_REQ);
    zmq_connect(requester, "tcp://localhost:5555");

    for (int request_nbr = 0; request_nbr < 10; request_nbr++) {
        printf("Sending Hello %d...\n", request_nbr);
        s_send(requester, "Hello");   // Simplified send

        char *reply = s_recv(requester);  // Simplified receive
        printf("Received World %d\n", request_nbr);
        free(reply);  // Free the dynamically allocated reply
    }

    zmq_close(requester);
    zmq_ctx_destroy(context);
    return 0;
}
