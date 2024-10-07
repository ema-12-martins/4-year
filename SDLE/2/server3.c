//  Hello World server (simplified with zhelpers.h)
#include <zmq.h>
#include <stdio.h>
#include <unistd.h>
#include <assert.h>
#include "zhelpers.h"

int main (void)
{
    //  Socket to talk to clients
    void *context = zmq_ctx_new();
    void *responder = zmq_socket(context, ZMQ_REP);
    int rc = zmq_bind(responder, "tcp://*:5555");
    assert(rc == 0);

    while (1) {
        char *request = s_recv(responder);  // Simplified receive
        printf("Received Hello\n");
        free(request);  // Free the dynamically allocated request
        
        sleep(1);  // Simulate some 'work'
        
        s_send(responder, "World");  // Simplified send
    }

    zmq_close(responder);
    zmq_ctx_destroy(context);
    return 0;
}
