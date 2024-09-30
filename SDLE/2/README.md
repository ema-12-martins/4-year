# Como compilar
Temos de usar flag.
~~~
gcc server.c -o server -lzmq
~~~

# Resultados
Se meter dois servers a correr, eles comunicam entre sí.

Se tentar matar o server e voltar a correr, é criado como se fosse um novo. 