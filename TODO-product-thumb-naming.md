# TODO: Product Thumb Naming

- Trocar o critério atual de nome das thumbs de produto em `public/generated/product-thumbs/`.
- Hoje o nome é posicional:
  - `{sectionIndex}-{productIndex}.avif`
- Problema:
  - o nome muda quando a ordem das seções ou dos produtos muda
  - dificulta debug
  - não preserva contexto do arquivo original

## Objetivo

- Usar um nome estável e legível, derivado da `imageUrl` original do produto.

## Proposta

- Extrair o nome do arquivo original da `imageUrl`, sem extensão.
- Gerar thumb local com padrão textual estável, por exemplo:
  - `{original-file-slug}-321x181.avif`
- Exemplos:
  - origem:
    - `1781044315066712419-teste-thumbs-spotren-ndex.avif`
  - thumb:
    - `1781044315066712419-teste-thumbs-spotren-ndex-321x181.avif`

## Regras desejadas

- Preservar a parte textual do arquivo original sempre que possível.
- Sanitizar para slug seguro de filesystem.
- Evitar colisão entre produtos com nomes iguais.
- Se houver colisão, acrescentar sufixo estável.
  - Exemplo:
    - `-{productIndex}`
    - ou hash curto derivado da URL original

## Ajustes necessários

- Atualizar `scripts/generate-product-thumbs.mjs`
  - gerar nome baseado em `imageUrl`
- Atualizar `src/pages/index.astro`
  - resolver a thumb local pelo mesmo critério
- Garantir compatibilidade com imagens remotas e locais
- Adicionar teste/regressão se houver cobertura para o pipeline de geração

## Critério de pronto

- Reordenar produtos não deve renomear thumbs sem necessidade.
- O nome da thumb deve continuar compreensível ao olhar o diretório.
