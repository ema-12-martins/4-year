import re

def generate_mutation_tests_with_operator_changes(original_test_code):
    # Lista de mutações de operadores possíveis
    operator_mutations = {
        '+': '-',
        '-': '+',
        '==': '!=',
        '!=': '==',
        '>': '<',
        '<': '>',
        '>=': '<=',
        '<=': '>='
    }

    # Vamos encontrar as assertivas no teste original e aplicar mutações de operadores
    lines = original_test_code.splitlines()
    new_tests = []

    for line in lines:
        if "assert" in line:
            mutated_tests = [line]  # Comece com o teste original
            # Substituir operadores matemáticos e de comparação nas assertivas
            for original_operator, mutated_operator in operator_mutations.items():
                if original_operator in line:
                    mutated_line = re.sub(re.escape(original_operator), mutated_operator, line)
                    mutated_tests.append(mutated_line)

            # Adicionar as versões mutadas do teste à lista de novos testes
            new_tests.extend(mutated_tests)

    return new_tests

# Teste original fornecido pelo usuário
original_test = """
def test_add():
    assert add(2, 3) == 5
"""

# Gerar novos testes mutantes trocando operadores
new_tests = generate_mutation_tests_with_operator_changes(original_test)

# Exibir os novos testes gerados
for i, test in enumerate(new_tests):
    print(f"Teste Mutante {i + 1}: {test}")