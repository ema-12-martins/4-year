#include <zmq.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>

int main(void) {
    // Inicialização do contexto ZMQ e do socket PUB
    void *context = zmq_ctx_new();
    void *publisher = zmq_socket(context, ZMQ_PUB);
    zmq_bind(publisher, "tcp://*:5556"); // Porta para PT

    srand(time(NULL)); // Inicializa o gerador de números aleatórios

    while (1) {
        // Geração de código postal de 4 dígitos (PT)
        int zipcode = rand() % 9000 + 1000;

        // Geração de dados aleatórios de temperatura e umidade
        int temperature = rand() % 51 - 10; // Temperatura entre -10 e 40
        int humidity = rand() % 91 + 10;    // Humidade entre 10 e 100

        // Formatação da mensagem
        char message[50];
        snprintf(message, sizeof(message), "%d %d %d", zipcode, temperature, humidity);
        printf("Enviando atualização PT: %s\n", message);

        // Envio da mensagem
        zmq_send(publisher, message, strlen(message), 0);

        sleep(1); // Pausa de 1 segundo
    }

    zmq_close(publisher);
    zmq_ctx_destroy(context);
    return 0;
}
