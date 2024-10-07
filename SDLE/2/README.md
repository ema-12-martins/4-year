# Como compilar
Temos de usar flag.
~~~
gcc server.c -o server -lzmq
~~~

# Resultados
Se meter dois servers a correr, eles comunicam entre sí.

Se tentar matar o server e voltar a correr, é criado como se fosse um novo. 

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