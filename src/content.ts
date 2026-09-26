export type MysterySet = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';
export type Mystery = { title: string; scripture: string; reflection: string };

export const mysteries: Record<MysterySet, { name: string; days: string; items: Mystery[] }> = {
  joyful: { name: 'Joyful', days: 'Monday & Saturday · Advent Sundays', items: [
    { title: 'The Annunciation', scripture: 'Luke 1:26–38', reflection: 'Mary welcomes God’s invitation. Bring to mind the places in your life where you are being asked to trust.' },
    { title: 'The Visitation', scripture: 'Luke 1:39–56', reflection: 'Mary goes in haste to Elizabeth. Consider how you might carry Christ’s love to someone who needs it.' },
    { title: 'The Nativity', scripture: 'Luke 2:1–20', reflection: 'Jesus is born in the simplicity of Bethlehem. Make room for him in the ordinary moments of your day.' },
    { title: 'The Presentation in the Temple', scripture: 'Luke 2:22–38', reflection: 'Mary and Joseph present Jesus to the Lord. Offer God the people and concerns you hold most dearly.' },
    { title: 'The Finding in the Temple', scripture: 'Luke 2:41–52', reflection: 'Mary and Joseph find Jesus in his Father’s house. Ask for a heart that continues to seek him.' },
  ] },
  luminous: { name: 'Luminous', days: 'Thursday', items: [
    { title: 'The Baptism of Jesus', scripture: 'Matthew 3:13–17', reflection: 'Jesus is baptized in the Jordan. Remember your call to live as a beloved child of God.' },
    { title: 'The Wedding at Cana', scripture: 'John 2:1–11', reflection: 'Mary asks the servants to listen to Jesus. Bring your needs to him with trust.' },
    { title: 'The Proclamation of the Kingdom', scripture: 'Mark 1:14–15', reflection: 'Jesus calls us to repentance and faith. Ask for the grace to turn toward him anew.' },
    { title: 'The Transfiguration', scripture: 'Matthew 17:1–8', reflection: 'The disciples glimpse the glory of Christ. Pause to listen for his voice amid the noise of life.' },
    { title: 'The Institution of the Eucharist', scripture: 'Matthew 26:26–29', reflection: 'Jesus gives himself to his disciples. Give thanks for his presence and his generous love.' },
  ] },
  sorrowful: { name: 'Sorrowful', days: 'Tuesday & Friday · Lent Sundays', items: [
    { title: 'The Agony in the Garden', scripture: 'Matthew 26:36–46', reflection: 'Jesus prays in his anguish. Bring your fears to the Father and pray for those who feel alone.' },
    { title: 'The Scourging at the Pillar', scripture: 'John 19:1', reflection: 'Jesus endures suffering. Hold in prayer those whose bodies or spirits are wounded.' },
    { title: 'The Crowning with Thorns', scripture: 'Matthew 27:27–31', reflection: 'Jesus is mocked and crowned with thorns. Ask for courage and gentleness in the face of cruelty.' },
    { title: 'The Carrying of the Cross', scripture: 'Luke 23:26–32', reflection: 'Jesus carries the cross to Calvary. Pray for strength to bear your burdens and to help carry another’s.' },
    { title: 'The Crucifixion', scripture: 'Luke 23:33–46', reflection: 'Jesus gives his life in love. Stay with him at the cross and receive the mercy he offers.' },
  ] },
  glorious: { name: 'Glorious', days: 'Wednesday · most Sundays', items: [
    { title: 'The Resurrection', scripture: 'Luke 24:1–12', reflection: 'Christ is risen. Bring the places that feel lifeless to the hope of his resurrection.' },
    { title: 'The Ascension', scripture: 'Acts 1:6–11', reflection: 'Jesus returns to the Father. Ask for the hope to follow him and the courage to carry on his work.' },
    { title: 'The Descent of the Holy Spirit', scripture: 'Acts 2:1–13', reflection: 'The Holy Spirit fills the disciples. Pray for the wisdom and love you need today.' },
    { title: 'The Assumption of Mary', scripture: 'Revelation 12:1 · traditional meditation', reflection: 'Mary is taken into heavenly glory. Entrust yourself to God’s promise of life beyond death.' },
    { title: 'The Coronation of Mary', scripture: 'Revelation 12:1 · traditional meditation', reflection: 'Mary is honored as Queen of Heaven. Ask her to pray with you and lead you closer to her Son.' },
  ] },
};

// Traditional English prayer texts. Contemporary wording varies between communities.
export const prayers = {
  cross: { title: 'Sign of the Cross', text: 'In the name of the Father,\nand of the Son,\nand of the Holy Spirit.\nAmen.' },
  creed: { title: 'The Apostles’ Creed', text: 'I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.' },
  father: { title: 'Our Father', text: 'Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come;\nthy will be done on earth as it is in heaven.\n\nGive us this day our daily bread;\nand forgive us our trespasses\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil.\nAmen.' },
  mary: { title: 'Hail Mary', text: 'Hail Mary, full of grace,\nthe Lord is with thee;\nblessed art thou among women,\nand blessed is the fruit of thy womb, Jesus.\n\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour of our death.\nAmen.' },
  glory: { title: 'Glory Be', text: 'Glory be to the Father,\nand to the Son,\nand to the Holy Spirit.\n\nAs it was in the beginning,\nis now, and ever shall be,\nworld without end.\nAmen.' },
  fatima: { title: 'The Fatima Prayer', text: 'O my Jesus, forgive us our sins,\nsave us from the fires of hell,\nlead all souls to heaven,\nespecially those in most need of thy mercy.\nAmen.' },
  queen: { title: 'Hail, Holy Queen', text: 'Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears.\n\nTurn then, most gracious advocate, thine eyes of mercy toward us; and after this our exile, show unto us the blessed fruit of thy womb, Jesus.\n\nO clement, O loving, O sweet Virgin Mary.' },
  closing: { title: 'Let Us Pray', text: 'Pray for us, O holy Mother of God.\nThat we may be made worthy of the promises of Christ.\n\nO God, whose only-begotten Son, by his life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that while meditating on these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord.\nAmen.' },
};
export type PrayerId = keyof typeof prayers;
