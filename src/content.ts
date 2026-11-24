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
  // The Vatican's text, including the invocations added in 2020, in US spelling.
  // Its versicle follows as the first lines of the closing prayer.
  litany: { title: 'The Litany of Loreto', text: [
    'Lord, have mercy.\nChrist, have mercy.\nLord, have mercy.\nChrist, hear us.\nChrist, graciously hear us.',
    ['God the Father of heaven', 'God the Son, Redeemer of the world', 'God the Holy Spirit', 'Holy Trinity, one God'].map(line => `${line}, have mercy on us.`).join('\n'),
    ...[
      ['Holy Mary', 'Holy Mother of God', 'Holy Virgin of virgins'],
      ['Mother of Christ', 'Mother of the Church', 'Mother of Mercy', 'Mother of divine grace', 'Mother of Hope', 'Mother most pure', 'Mother most chaste', 'Mother inviolate', 'Mother undefiled', 'Mother most amiable', 'Mother most admirable', 'Mother of good counsel', 'Mother of our Creator', 'Mother of our Savior'],
      ['Virgin most prudent', 'Virgin most venerable', 'Virgin most renowned', 'Virgin most powerful', 'Virgin most merciful', 'Virgin most faithful'],
      ['Mirror of justice', 'Seat of wisdom', 'Cause of our joy', 'Spiritual vessel', 'Vessel of honor', 'Singular vessel of devotion', 'Mystical rose', 'Tower of David', 'Tower of ivory', 'House of gold', 'Ark of the covenant', 'Gate of heaven', 'Morning star', 'Health of the sick', 'Refuge of sinners', 'Solace of Migrants', 'Comfort of the afflicted', 'Help of Christians'],
      ['Queen of Angels', 'Queen of Patriarchs', 'Queen of Prophets', 'Queen of Apostles', 'Queen of Martyrs', 'Queen of Confessors', 'Queen of Virgins', 'Queen of all Saints', 'Queen conceived without original sin', 'Queen assumed into heaven', 'Queen of the most holy Rosary', 'Queen of families', 'Queen of peace'],
    ].map(group => group.map(line => `${line}, pray for us.`).join('\n')),
    ['spare us, O Lord.', 'graciously hear us, O Lord.', 'have mercy on us.'].map(response => `Lamb of God, who takes away the sins of the world, ${response}`).join('\n'),
  ].join('\n\n') },
  closing: { title: 'Let Us Pray', text: 'Pray for us, O holy Mother of God.\nThat we may be made worthy of the promises of Christ.\n\nO God, whose only-begotten Son, by his life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that while meditating on these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord.\nAmen.' },
  michael: { title: 'Prayer to St. Michael', text: 'St. Michael the Archangel,\ndefend us in battle.\nBe our defense against the wickedness and snares of the Devil.\nMay God rebuke him, we humbly pray,\nand do thou, O Prince of the heavenly hosts,\nby the power of God,\nthrust into hell Satan,\nand all the evil spirits,\nwho prowl about the world\nseeking the ruin of souls.\nAmen.' },
};
export type PrayerId = keyof typeof prayers;
export type Prayer = { title: string; text: string };
export type Language = 'english' | 'latin';

// Latin follows the Common Prayers of the Compendium of the Catechism of the
// Catholic Church (Vatican, 2005); its acute accents mark the stressed syllable
// and are completed here where it leaves them off. The closing versicle and
// collect are the Rosary feast's. The Fatima Prayer has no official Latin; this
// is the common rendering closest to the Portuguese. The Litany of Loreto and
// the St. Michael prayer, which the Compendium omits, are accented likewise.
export const latinPrayers: Record<PrayerId, Prayer> = {
  cross: { title: 'Signum Crucis', text: 'In nómine Patris\net Fílii\net Spíritus Sancti.\nAmen.' },
  creed: { title: 'Symbolum Apostolicum', text: 'Credo in Deum Patrem omnipoténtem, Creatórem cæli et terræ, et in Iesum Christum, Fílium Eius únicum, Dóminum nostrum, qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus, descéndit ad ínferos, tértia die resurréxit a mórtuis, ascéndit ad cælos, sedet ad déxteram Dei Patris omnipoténtis, inde ventúrus est iudicáre vivos et mórtuos.\n\nEt in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam ætérnam. Amen.' },
  father: { title: 'Pater Noster', text: 'Pater noster, qui es in cælis:\nsanctificétur Nomen Tuum:\nadvéniat Regnum Tuum:\nfiat volúntas Tua,\nsicut in cælo, et in terra.\n\nPanem nostrum cotidiánum da nobis hódie,\net dimítte nobis débita nostra,\nsicut et nos dimíttimus debitóribus nostris.\nEt ne nos indúcas in tentatiónem;\nsed líbera nos a Malo.\nAmen.' },
  mary: { title: 'Ave Maria', text: 'Ave, María, grátia plena,\nDóminus tecum.\nBenedícta tu in muliéribus,\net benedíctus fructus ventris tui, Iesus.\n\nSancta María, Mater Dei,\nora pro nobis peccatóribus,\nnunc et in hora mortis nostræ.\nAmen.' },
  glory: { title: 'Gloria Patri', text: 'Glória Patri\net Fílio\net Spirítui Sancto.\n\nSicut erat in princípio,\net nunc et semper\net in sæcula sæculórum.\nAmen.' },
  fatima: { title: 'Oratio Fatimæ', text: 'O mi Iesu, dimítte nobis débita nostra,\nlíbera nos ab igne inférni,\nconduc in cælum omnes ánimas,\npræsértim illas quæ máxime índigent misericórdia tua.\nAmen.' },
  queen: { title: 'Salve Regina', text: 'Salve, Regína, Mater misericórdiæ, vita, dulcédo et spes nostra, salve. Ad te clamámus, éxsules fílii Evæ. Ad te suspirámus geméntes et flentes in hac lacrimárum valle.\n\nEia ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte. Et Iesum benedíctum fructum ventris tui, nobis, post hoc exsílium, osténde.\n\nO clemens, o pia, o dulcis Virgo María.' },
  // The 2020 invocations follow Mater Ecclésiæ, Mater divínæ grátiæ and
  // Refúgium peccatórum. "Foederis" is unligatured: œ is outside Latin-1.
  litany: { title: 'Litaniæ Lauretanæ', text: [
    'Kýrie, eléison.\nChriste, eléison.\nKýrie, eléison.\nChriste, audi nos.\nChriste, exáudi nos.',
    ['Pater de cælis, Deus', 'Fili, Redémptor mundi, Deus', 'Spíritus Sancte, Deus', 'Sancta Trínitas, unus Deus'].map(line => `${line}, miserére nobis.`).join('\n'),
    ...[
      ['Sancta María', 'Sancta Dei Génetrix', 'Sancta Virgo vírginum'],
      ['Mater Christi', 'Mater Ecclésiæ', 'Mater misericórdiæ', 'Mater divínæ grátiæ', 'Mater spei', 'Mater puríssima', 'Mater castíssima', 'Mater invioláta', 'Mater intemeráta', 'Mater amábilis', 'Mater admirábilis', 'Mater boni consílii', 'Mater Creatóris', 'Mater Salvatóris'],
      ['Virgo prudentíssima', 'Virgo veneránda', 'Virgo prædicánda', 'Virgo potens', 'Virgo clemens', 'Virgo fidélis'],
      ['Spéculum iustítiæ', 'Sedes sapiéntiæ', 'Causa nostræ lætítiæ', 'Vas spirituále', 'Vas honorábile', 'Vas insígne devotiónis', 'Rosa mýstica', 'Turris Davídica', 'Turris ebúrnea', 'Domus áurea', 'Foederis arca', 'Iánua cæli', 'Stella matutína', 'Salus infirmórum', 'Refúgium peccatórum', 'Solácium migrántium', 'Consolátrix afflictórum', 'Auxílium christianórum'],
      ['Regína Angelórum', 'Regína Patriarchárum', 'Regína Prophetárum', 'Regína Apostolórum', 'Regína Mártyrum', 'Regína Confessórum', 'Regína Vírginum', 'Regína Sanctórum ómnium', 'Regína sine labe origináli concépta', 'Regína in cælum assúmpta', 'Regína sacratíssimi Rosárii', 'Regína famíliæ', 'Regína pacis'],
    ].map(group => group.map(line => `${line}, ora pro nobis.`).join('\n')),
    ['parce nobis, Dómine.', 'exáudi nos, Dómine.', 'miserére nobis.'].map(response => `Agnus Dei, qui tollis peccáta mundi, ${response}`).join('\n'),
  ].join('\n\n') },
  closing: { title: 'Oremus', text: 'Ora pro nobis, sancta Dei Génetrix.\nUt digni efficiámur promissiónibus Christi.\n\nDeus, cuius Unigénitus per vitam, mortem et resurrectiónem suam nobis salútis ætérnæ præmia comparávit, concéde, quæsumus, ut hæc mystéria sacratíssimo beátæ Maríæ Vírginis Rosário recoléntes, et imitémur quod cóntinent, et quod promíttunt assequámur. Per eúndem Christum Dóminum nostrum.\nAmen.' },
  // Leo XIII's prayer. A stressed diphthong (proelio) carries no accent, as
  // its accented forms are outside Latin-1.
  michael: { title: 'Sancte Michaël', text: 'Sancte Míchaël Archángele,\ndefénde nos in proelio;\ncontra nequítiam et insídias diáboli esto præsídium.\nÍmperet illi Deus, súpplices deprecámur:\ntuque, Princeps milítiæ cæléstis,\nSátanam aliósque spíritus malígnos,\nqui ad perditiónem animárum pervagántur in mundo,\ndivína virtúte in inférnum detrúde.\nAmen.' },
};
export const prayerTexts: Record<Language, Record<PrayerId, Prayer>> = { english: prayers, latin: latinPrayers };
