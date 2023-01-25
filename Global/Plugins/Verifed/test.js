const {
    MessageActionRow,
    Message,
    MessageEmbed,
    MessageButton,
  } = require("discord.js");
  
  /**
   * Düğmeler ile sayfa oluşturma!
   * Sayfalar Array şeklinde olmalıdır.
   * Düğmeler Array şeklinde olmalıdır.
   * Tip değeri EMBED/CONTENT olmalıdır.
   * Embed seçilir ise sayfalara MessageEmbed ile embed oluşturulmalıdır. 
   * Content seçilir ise sayfalara String olarak oluşturulmalıdır.
   * Düğmelere zaman aşımı eklemek istiyorsan zaman aşımı değeri gerekli direk milisaniye cinsinden.
   * Embed tipi seçili ise detail içeriği kullanılabilir. Aktif ise aşağıda sayfa bilgisi yazar.
   * Bitiş sayfası istiyorsan Finish değeri açılmalı ve finishPage'e Array indexi girilmelidir.
   * 
   * @param {Interaction} interaction
   * @param {MessageEmbed[]} pages
   * @param {MessageButton[]} buttons
   * @param {string} type
   * @param {number} timeout
   * @param {boolean} detail
   * @param {boolean} finish
   * @param {number} finishPage
   * @returns
   */
  
  const pageEmbed = async (
    interaction,
    pages,
    buttons,
    type = "EMBED",
    timeout = 120000,
    detail = true,
    finish = false,
    finishPage = 0
) => {
    if (!pages) throw new Error("Sayfalar bulunamadı.");
    if (!buttons) throw new Error("Düğmeler bulunamadı.");
    if (!timeout) throw new Error("Zaman aşımı değeri gerekli.");
    if (!type) throw new Error("Tip değeri gerekli. EMBED/CONTENT");
    if (buttons[0].style === "LINK" || buttons[1].style === "LINK")
      throw new Error(
        "Bağlantı düğmeleri kullanılamaz. Lütfen bağlantı düğmelerini kaldırın."
      );
    if (buttons.length !== 2) throw new Error("Düğmeler 2 tane olmalıdır.");
  
    let page = 0;
    let oldLabelName = buttons[1].label
    const row = new MessageActionRow().addComponents(buttons);
    const finishRow = new MessageActionRow().addComponents(buttons[1]);
  
    if (interaction.deferred == false) {
      await interaction.deferReply();
    }
  
    let curPage;
    if(type == "EMBED") {
       curPage = await interaction.editReply({
            embeds: [pages[page].setFooter(detail ? { text: `Sayfa ${page + 1} / ${pages.length}` } : null)],
            components: [row],
            fetchReply: true,
        });
    } else if(type == "CONTENT") {
        curPage = await interaction.editReply({
            content: `${pages[page]}`,
            components: [row],
            fetchReply: true,
        });
    }
  
    const filter = (i) =>
      i.customId === buttons[0].customId ||
      i.customId === buttons[1].customId;
  
    const collector = await curPage.createMessageComponentCollector({
      filter,
      time: timeout,
    });
  
    collector.on("collect", async (i) => {
      switch (i.customId) {
        case buttons[0].customId:
          page = page > 0 ? --page : pages.length - 1;
          break;
  
        case buttons[1].customId:
          page = page + 1 < pages.length ? ++page : finish ? page : 0;
          if(finish && page >= finishPage - 1) {
            buttons[1].label = "Bitir!";
            buttons[1].style = "SUCCESS"
          }
          if(finish && page == finishPage) {
            buttons[1].disabled = true;
            buttons[0].disabled = true;
          }
          break;
        default:
          break;
      }
      await i.deferUpdate();
      if(type == "EMBED") {
        await i.editReply({
            embeds: [pages[page].setFooter(detail ? { text: `Sayfa ${page + 1} / ${pages.length}` } : null)],
            components: [finish ? page == finishPage ? finishRow : row : row],
          });
      } else if(type == "CONTENT") {
        await i.editReply({
            content: `${pages[page]}`,
            components: [finish ? page == finishPage ? finishRow : row : row],
          });
      }
      collector.resetTimer();
    });
  
    collector.on("end", (_, reason) => {
      if (reason !== "messageDelete") {
        const disabledRow = new MessageActionRow().addComponents(
          buttons[0].setDisabled(true),
          buttons[1].setDisabled(true)
        );
        if(type == "EMBED") {
            curPage.edit({
                embeds: [pages[page].setFooter(detail ? { text: `Sayfa ${page + 1} / ${pages.length}` } : null)],
                components: [disabledRow],
            });
        } else if(type == "CONTENT") {
            curPage.edit({
                content: `${pages[page]}`,
                components: [disabledRow],
            });
        }
      }
    });
  
    return curPage;
  };
  module.exports = {
      pageEmbed
  };
  