import sys

def filtrar_conteudo(entrada, saida):
    with open(entrada, 'r') as arquivo_entrada:
        linhas = arquivo_entrada.readlines()

    # Variável para armazenar o conteúdo filtrado
    conteudo_filtrado = []
    dentro_do_bloco = False

    # Itera sobre cada linha para encontrar o conteúdo entre as linhas de separação
    for linha in linhas:
        if "--------------------------------------------------------------------------------" in linha:
            # Alterna o estado quando encontra uma linha de separação
            dentro_do_bloco = not dentro_do_bloco
            continue  # Ignora a linha de separação

        if dentro_do_bloco:
            conteudo_filtrado.append(linha)  # Adiciona a linha ao conteúdo filtrado

    # Grava o conteúdo filtrado no arquivo de saída
    with open(saida, 'w') as arquivo_saida:
        arquivo_saida.writelines(conteudo_filtrado)

if __name__ == "__main__":
    try:
        arquivo_entrada = sys[1]
        arquivo_saida = sys[2]
        filtrar_conteudo(arquivo_entrada, arquivo_saida)
    except:
        print("Houve algum problema a abrir o ficheiro")
