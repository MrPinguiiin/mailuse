import "dotenv/config";
import { SMTPServer } from "smtp-server";
import { env } from "@mailuse/env/server";
import { handleMessage } from "./handler";
import { createLogger } from "./logger";

const logger = createLogger("smtp");

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ["AUTH"],
  banner: `${env.SMTP_DOMAIN || env.DOMAIN || env.APP_DOMAIN} ESMTP mailuse`,
  size: 10 * 1024 * 1024, // 10MB max

  onConnect(session, callback) {
    logger.info({ remoteAddress: session.remoteAddress }, "Client connected");
    callback();
  },

  onMailFrom(address, session, callback) {
    logger.info({ from: address.address }, "MAIL FROM");
    callback();
  },

  onRcptTo(address, session, callback) {
    const domain = address.address.split("@")[1];
    const allowedDomain = env.SMTP_DOMAIN || env.DOMAIN || env.APP_DOMAIN;

    if (domain !== allowedDomain) {
      logger.warn({ to: address.address, domain }, "Rejected: domain not served");
      return callback(new Error(`Domain ${domain} not served here`));
    }

    callback();
  },

  onData(stream, session, callback) {
    handleMessage(stream, session)
      .then(() => {
        callback();
      })
      .catch((err) => {
        logger.error({ err }, "Error processing message");
        callback(new Error("Error processing message"));
      });
  },

  onClose(session) {
    logger.info({ remoteAddress: session.remoteAddress }, "Client disconnected");
  },
});

const port = env.SMTP_PORT;
server.listen(port, () => {
  logger.info({ port, domain: env.SMTP_DOMAIN || env.APP_DOMAIN }, "SMTP server listening");
});

server.on("error", (err) => {
  logger.error({ err }, "SMTP server error");
});
