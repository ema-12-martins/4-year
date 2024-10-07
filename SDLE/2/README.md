# Como compilar
Temos de usar flag.
~~~
gcc server.c -o server -lzmq
~~~

# Resultados
Try running the client rst and then the server
- O client fica à espera do servidor correr.

Try adding another server and see the distribution of requests
- Nao dá para correr dois servers ao mesmo tempo porque estão a dar bind na merma porta.

Try killing and re-starting the server
- Se matar o server enquanto tiver a comunicar com o server, tentar reiniciar ele nao consegue ligar ao mano.

# Sacar zhelpers.h 
~~~
git clone https://github.com/imatix/zguide.git
~~~
Depois já podemos adicionar o .h:
~~~c
#include "zhelpers.h"
~~~
Para correr ao compilar temos de -I e o caminho para onde esta o .h.
Acrescentar tambem -L para acrescentar á dinamic library.

# Simplificações
O Zhelpers permite mandar strings diretamente

Para receber:
~~~
ZMQ_M56_T REQ;
ZMQ_M56_INIT(&REQ);
ZMQ_M56_RECV(&REQ,SREP,0);
ZMQ_M56_ClOSE(&REQ);
...
ZMQ_CLOSE(SREP);
ZMQ_CTX_DESTROY(CTX);
~~~

Para enviar:
~~~
ZMQ_M56_T REQ;
ZMQ_M56_INIT_SIZE(&REQ,S);
ZMQ_M56_SED(&REQ,SRE,S);
~~~

---
Para termos dois servidores a dar bind, tem de estar em portas diferentes. Podemos ter 2 connects no mesmo request, podemos ter 2 replies. A queue vai ser dividida para receber os 2 pedidos, distruibuindo-os pela mesma.