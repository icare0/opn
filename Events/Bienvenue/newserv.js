module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(guild) {
      const channel = guild.systemChannel; // Utilise le canal système du serveur
      if (!channel) return;
  
      try {
        await channel.send(`**Merci** d'avoir ajouté **OPN** à ton serveur🌟
C'est un bot open source qui grandit grâce à la **__communauté__** et à son soutien précieux.
Nous espérons que tu apprécieras les fonctionnalités offertes par OPN 
et que tu participeras à son développement en partageant tes idées et en contribuant à son amélioration.

:question: Si tu as besoin d'aide, n'hésite pas à rejoindre le serveur de support... Et merci de vérifier que toutes les permissions sont correctement configurées.
  
    **Merci encore d'avoir ajouté OPN à ${guild.name}** !`);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message de bienvenue :', error);
      }
    },
  };