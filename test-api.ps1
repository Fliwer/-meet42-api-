# ===== Script de test manuel de l'API Meet42 =====
# Prérequis avant de lancer ce script : Docker démarré, et "npm run dev" qui tourne
# dans un autre terminal.

# on stocke l'adresse de base une seule fois, pour ne pas la répéter à chaque appel
$baseUrl = "http://localhost:8080/api"

# Get-Random génère un nombre aléatoire à chaque exécution du script
# => un email différent à chaque fois, pour ne jamais tomber sur le 409 "email déjà utilisé"
$emailTest = "test-$(Get-Random)@meet42.be"

# Write-Host affiche juste du texte à l'écran, pour se repérer entre les étapes
# `n = retour à la ligne (comme \n en JavaScript)
Write-Host "`n--- 1. REGISTER (inscription) ---"

Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body "{`"email`":`"$emailTest`",`"password`":`"motdepasse123`",`"display_name`":`"Test`",`"birth_date`":`"1995-03-20`"}"

Write-Host "`n--- 2. LOGIN (connexion, recupere le token) ---"

# même appel que d'habitude, mais stocké dans $reponse pour réutiliser le token juste après
$reponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body "{`"email`":`"$emailTest`",`"password`":`"motdepasse123`"}"

# on affiche le token reçu, juste pour vérifier visuellement que ça a marché
Write-Host "Token recu :" $reponse.token

Write-Host "`n--- 3. DELETE ACCOUNT (route protegee par le token) ---"

# -Headers @{ ... } : on ajoute l'en-tête Authorization à la requête, comme un vrai client connecté
# "Bearer $($reponse.token)" : $(...) permet d'insérer une expression (pas juste une variable simple)
# à l'intérieur d'une chaîne de texte
Invoke-RestMethod -Uri "$baseUrl/users/me" -Method DELETE -Headers @{ Authorization = "Bearer $($reponse.token)" }

Write-Host "`n--- 4. Verification : login apres suppression doit echouer (401) ---"

# try/catch : même principe qu'en TypeScript. On s'attend à ce que ça échoue ICI (le compte
# n'existe plus), donc l'erreur est NORMALE et voulue, pas un bug du script
try {
    Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body "{`"email`":`"$emailTest`",`"password`":`"motdepasse123`"}"
} catch {
    # $_.Exception.Message : "$_" représente l'erreur attrapée par le catch (l'équivalent
    # de "erreur" dans tes catch (erreur) en TypeScript), et .Exception.Message en extrait le texte
    Write-Host "Echec attendu, le compte n'existe plus :" $_.Exception.Message
}
