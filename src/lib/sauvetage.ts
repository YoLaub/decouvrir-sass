/** Starter files of the "sauvetage du CSS legacy" activity, shared by the page and the downloads. */

export const legacyCss = `/* legacy.css : fichier hérité, à refactoriser */
body {
  color: #333333;
  font-family: Arial, sans-serif;
}

a {
  color: #2c5aa0;
}

h2 {
  color: #333333;
}

h1 {
  color: #2c5aa0;
  border-bottom: 2px solid #2c5aa0;
}

.btn-primary {
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid #2c5aa0;
  background: #2c5aa0;
  color: white;
}

.btn-danger {
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid #c0392b;
  background: #c0392b;
  color: white;
}

.card {
  border: 1px solid #333333;
  padding: 16px;
}

.card p {
  color: #333333;
}

.card-title {
  color: #c0392b;
  font-size: 20px;
}

.card-hover {
  border-color: #2c5aa0;
}

.alert {
  color: #c0392b;
  border-left: 4px solid #c0392b;
}
`;

export const effectsPartial = `// _effects.scss : ombres réutilisables
@mixin lift($shadow) {
  box-shadow: 0 4px 12px $shadow;
  transform: translateY(-2px);
}

.card-hover:hover {
  @include lift;
}
`;

export const indexHtml = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Sauvetage CSS</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Titre de la page</h1>
  <p>Un texte avec <a href="#">un lien</a>.</p>
  <button class="btn-primary">Valider</button>
  <button class="btn-danger">Supprimer</button>
  <div class="card card-hover">
    <h2 class="card-title">Une carte</h2>
    <p>Son contenu.</p>
  </div>
  <p class="alert">Un message d'alerte.</p>
</body>
</html>
`;
