import random

def generate_mutation_tests(original_test_code):
    # Lista de mutações que podemos aplicar aos valores dos testes
    mutations = [
        lambda x: x + 1,        # Incrementa o valor
        lambda x: x - 1,        # Decrementa o valor
        lambda x: x * 2,        # Multiplica por 2
        lambda x: x // 2,       # Divide por 2 (inteira)
        lambda x: -x            # Negativo do valor
    ]

    # Vamos encontrar os valores de entrada e valor esperado no teste original
    lines = original_test_code.splitlines()
    new_tests = []

    for line in lines:
        if "assert" in line:
            # Extraindo valores de entrada e esperado
            parts = line.split("add(")[1].split(")")[0]
            inputs = [int(x.strip()) for x in parts.split(",")]
            expected_result = int(line.split("==")[1].strip())

            # Gerar novas variações de testes a partir das mutações
            for mutation in mutations:
                new_inputs = [mutation(value) for value in inputs]
                new_expected = mutation(expected_result)
                new_test = f"assert add({new_inputs[0]}, {new_inputs[1]}) == {new_expected}"
                new_tests.append(new_test)

    return new_tests

# Teste original fornecido pelo usuário
original_test = """
def test_add():
    assert add(2, 3) == 5
"""

# Gerar novos testes mutantes
new_tests = generate_mutation_tests(original_test)

# Exibir os novos testes gerados
for i, test in enumerate(new_tests):
    print(f"Teste Mutante {i + 1}: {test}")