L'admin panel sarà semplicemente una CLI command-based sviluppata in python con i principali comandi di amministrazione.

```sql 
< > - Obbligatorio
[ ] - Opzionale

ban    <userId> [time]               -- Banna un utente
delete user <userId> [reason]        -- Rimuove/Disabilita un account
delete post <postId> [reason]        -- Rimuove un post
delete comment <commentId> [reason]  -- Rimuove un commento
verify <add|remove> <userId>         -- Aggiunge/Rimuove il verificato
admin  list                          -- Mostra tutti gli admins
admin  <add|remove> <userId>         -- Aggiunge/Rimuove amministratori

```
Molto minimale, senza colori. Si interfaccia direttamente con il server.