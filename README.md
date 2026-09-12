# New Docs

New document site for the Software Engineering Student Division (IT) with the
goal of replacing [cthit/dokument-site](https://github.com/cthit/dokument-site).

## Planned features

- Include other documents than the ones from [cthit/dokument](https://github.com/cthit/dokument)
- Divide documents into categories:
    - "Verksamhetsdokument" - Bylaws and regulations
        - "Verksamhetsdokument/Policier" - Policies
    - "Avtal" - Dispositionsavtal
    - "Sektionsmötesprotokoll" - Division meeting minutes
        - "Sektionsmötesprotokoll/Bilagor" - Maybe show attachments as separate documents if the data is available
    - "Styrelsemötesprotokoll" - Board meeting minutes
    - "Studienämndsprotokoll" - Student education group meeting minutes
    - "Hedersmedlemmar" - Honorary members (may be removed entirely)
    - "Annat" - Other documents
- Remove template documents
- Searchable documents
    - Search content in the PDFs.
    - Select which category of document you want to search in.
- File history?
- Prettier document titles with diacritics.

## Development

```bash
pnpm install
pnpm prisma generate
docker compose up -d
pnpm prisma migrate dev
pnpm run dev
```

## Production build

Run the `compose.prod.yaml` file using
[Docker Compose](https://docs.docker.com/compose).
