/* eslint-disable no-magic-numbers */
import { AbyssalConquerorID, NonEleCrownID } from "../lib/roleIDs.js";
import {
  // eslint-disable-next-line no-unused-vars
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from "discord.js";
import { EmbedColor } from "../lib/constants.js";
import { PepeKekPoint } from "../lib/emoteIDs.js";
import PermCheck from "../lib/staff-roles.js";
import { crownRoles } from "../lib/achievement-roles.js";
import { roleMention } from "@discordjs/builders";

/**
 * assigns one role
 * @async
 * @function giveRoleOne
 * @param {CommandInteraction} interaction - interaction object
 */
export async function giveRoleOne(interaction) {
  await interaction.deferReply();
  const exp = 250,
    filterCollector = (interacted) => {
      interacted.deferUpdate();
      return interacted.user.id === interaction.user.id;
    },
    permcheck = new PermCheck(interaction.member),
    role = await interaction.options.getString("role"),
    target = await interaction.options.getMember("user");
  let additionalNotes = "None",
    totalExp = exp;

  if (permcheck.isStaff() || permcheck.canGibRole()) {
    if (role === AbyssalConquerorID) {
      totalExp = exp;
      const spiralAbyssEmbed = new MessageEmbed()
          .setColor(EmbedColor)
          .setTitle("**Cleared with traveler?**")
          .setDescription(`Did ${target} clear abyss with traveler?`),
        spiralAbyssRow = new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("abyssWithTraveler")
            .setLabel("Cleared with traveler")
            .setEmoji("👍")
            .setStyle("PRIMARY"),
          new MessageButton()
            .setCustomId("abyssNoTraveler")
            .setLabel("Not cleared with traveler")
            .setEmoji("👎")
            .setStyle("SECONDARY")
        ]),
        spiralAbyssStat = await interaction.editReply({
          components: [spiralAbyssRow],
          embeds: [spiralAbyssEmbed]
        });

      await spiralAbyssStat
        .awaitMessageComponent({
          componentType: "BUTTON",
          filter: filterCollector,
          time: 15000
        })
        .then((button) => {
          if (button.customId === "abyssWithTraveler") {
            totalExp += exp;
            interaction.client.emit("spiralAbyssClear", target, true);
            additionalNotes = "Cleared with traveler!";
          }
          else {
            interaction.client.emit("spiralAbyssClear", target, false);
          }
        })
        .catch((error) => {
          console.error(error);
          interaction.client.emit("spiralAbyssClear", target, false);
        });
    }

    if (crownRoles.includes(role)) {
      totalExp = 0;
      let crownAmt = 1;
      const crownAmtRow = new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("1")
            .setEmoji("1️⃣")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("2")
            .setEmoji("2️⃣")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setCustomId("3")
            .setEmoji("3️⃣")
            .setStyle("SECONDARY")
        ]),
        crownRoleEmbed = new MessageEmbed()
          .setColor(EmbedColor)
          .setTitle("**How many crowns?**")
          .setDescription(`How many crowns did ${target} use on traveler for ${roleMention(role)}?`),
        crownStat = await interaction.editReply({
          components: [crownAmtRow],
          embeds: [crownRoleEmbed]
        });

      await crownStat
        .awaitMessageComponent({
          componentType: "BUTTON",
          filter: filterCollector,
          time: 10000
        })
        .then((button) => {
          if (button.customId === "1") {
            crownAmt = 1;
            totalExp += exp;
          }
          else if (button.customId === "2") {
            crownAmt = 2;
            totalExp += exp * crownAmt;
          }
          else if (button.customId === "3") {
            crownAmt = 3;
            totalExp += exp * crownAmt * 2;
          }
          additionalNotes = `Crowns used: ${crownAmt}`;
          interaction.client.emit("travelerCrown", target, {
            crownRoleID: role,
            crowns: crownAmt
          });
        })
        .catch((error) => {
          totalExp += exp;
          console.error(error);

          interaction.client.emit("travelerCrown", target, {
            crownRoleID: role,
            crowns: crownAmt
          });
        });
    }
    if (role === NonEleCrownID) {
      totalExp = 30000;
      interaction.client.emit("travelerCrown", target, {
        crownRoleID: NonEleCrownID,
        crowns: 1
      });
    }
    target.roles.add(role);

    const finalEmbed = new MessageEmbed()
      .setColor(EmbedColor)
      .setTitle("**Role Given!**")
      .setDescription(`${roleMention(role)} given to ${target}`);

    if (additionalNotes !== "None") {
      finalEmbed.addField("**Additional notes**", additionalNotes);
    }
    await interaction.editReply({
      components: [],
      embeds: [finalEmbed]
    });
    await interaction.followUp({
      components: [],
      content: `>award ${target.id} ${totalExp}`,
      ephemeral: true
    });
    await interaction.followUp({
      components: [],
      content:
        "Copy paste that command. And a message by <@!485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)",
      ephemeral: true
    });
  }
  else {
    await interaction.editReply({
      components: [],
      content: `You can't give roles, not even to yourself ${PepeKekPoint}`,
      ephemeral: true
    });
  }
}
