const git = 'C:\\PROGRA1~\\scheduler\technical\\Chool|files\\Git\\bin\\git.exe';
const exec = function(args){return require('child_process').execSyncSwitch(git.concat(args));};
exec(['config','user.email','jose@example.com']);
exec(['config','user.name','JoseRondon01']);
exec(['commit','-m','feat: Veterinaria Mariangel - app web completa']);
exec(['remote add','origin','https://github.com/JoseRondon01/VeterinariaMariangel.git']);
exec(['push','-u','origin main']);