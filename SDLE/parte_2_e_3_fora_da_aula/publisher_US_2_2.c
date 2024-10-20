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
    zmq_bind(publisher, "tcp://*:5555"); // Porta para US

    srand(time(NULL)); // Inicializa o gerador de números aleatórios

    while (1) {
        // Geração de código postal de 5 dígitos (US)
        int zipcode = rand() % 90000 + 10000;

        // Geração de dados aleatórios de temperatura e umidade
        int temperature = rand() % 71 - 20; // Temperatura entre -20 e 50
        int humidity = rand() % 91 + 10;    // Humidade entre 10 e 100

        // Formatação da mensagem
        char message[50];
        snprintf(message, sizeof(message), "%d %d %d", zipcode, temperature, humidity);
        printf("Enviando atualização US: %s\n", message);

        // Envio da mensagem
        zmq_send(publisher, message, strlen(message), 0);

        sleep(1); // Pausa de 1 segundo
    }

    zmq_close(publisher);
    zmq_ctx_destroy(context);
    return 0;
}
