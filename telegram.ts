/*******************************************************************************
 * Functions for Telegram
 *
 * Company: Cytron Technologies Sdn Bhd
 * Website: http://www.cytron.io
 * Email:   support@cytron.io
 *******************************************************************************/

// Telegram API url.
const TELEGRAM_API_URL = "api.telegram.org"
const APEXServer ="g6d9abcb7cf856d-jegyed50db21c.adb.uk-london-1.oraclecloudapps.com"
// HTTPS (SSL) port:443
namespace esp8266 {
    // Flag to indicate whether the Telegram message was sent successfully.
    let telegramMessageSent = false
    let APEXServerConnectionTestOK = false
    let APEXMessageSent = false



    /**
     * Return true if the Telegram message was sent successfully.
     */
    //% subcategory="Telegram"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_telegram_message_sent
    //% block="Telegram message sent"
    export function isTelegramMessageSent(): boolean {
        return telegramMessageSent
    }



    /**
     * Send Telegram message.
     * @param apiKey Telegram API Key.
     * @param chatId The chat ID we want to send message to.
     */
    //% subcategory="Telegram"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_telegram_message
    //% block="send message to Telegram:|API Key %apiKey|Chat ID %chatId|Message %message"
    export function sendTelegramMessage(apiKey: string, chatId: string, message: string) {

        // Reset the upload successful flag.
        telegramMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to Telegram. Return if failed.
        if (sendCommand("AT+CIPSTART=\"SSL\",\"" + TELEGRAM_API_URL + "\",443", "OK", 10000) == false) return

        // Construct the data to send.
        let data = "GET /bot" + formatUrl(apiKey) + "/sendMessage?chat_id=" + formatUrl(chatId) + "&text=" + formatUrl(message)
        data += " HTTP/1.1\r\n"
        data += "Host: " + TELEGRAM_API_URL + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from Telegram.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        telegramMessageSent = true
        return
    }
 /** APEX ===================================================================================
    /**
     * Test the APEX Server Connection
     */
    //% subcategory="APEX"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_telegram_message_sent
    //% block="APEXServerConnectionTest"
    export function APEXServerConnectionTest(): boolean {
        APEXServerConnectionTestOK = false
        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to APEX server (ORDS). Return if failed.
        return (sendCommand("AT+CIPSTART=\"SSL\",\"" + APEXServer + "\",443", "OK", 10000))
    }

    APEXMessageSent
        /**
     * Return true if the APEX message sent
     */
    //% subcategory="APEX"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_telegram_message_sent
    //% block="APEXMessageSent"
    export function fAPEXMessageSent(): boolean {
        return APEXMessageSent
    }
    /*
     * Send to APEX Application process
     * Sample: https://g6d9abcb7cf856d-jegyed50db21c.adb.uk-london-1.oraclecloudapps.com/ords/f?p=106:6::APPLICATION_PROCESS=LOG_DATA_01:::P6_FIELD1:-99.9
     * @param apiKey Telegram API Key.
     * @param chatId The chat ID we want to send message to.
     */
    //% subcategory="APEX"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_APEX_message
    //% block="send message to APEX:Message %message"
    export function SendMessageToAPEXApplicationProcesse(message: string) {

        // Reset the APEXMessageSent flag.
        APEXMessageSent = false
        APEXServerConnectionTestOK = false
        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to APEX server (ORDS). Return if failed.
        APEXServerConnectionTestOK = (sendCommand("AT+CIPSTART=\"SSL\",\"" + APEXServer + "\",443", "OK", 10000))
        if (APEXServerConnectionTestOK == false) return

        // Construct the data to send.
       // let data = "GET /bot" + formatUrl(apiKey) + "/sendMessage?chat_id=" + formatUrl(chatId) + "&text=" + formatUrl(message)
        let data = "/ords/f?p=106:6::APPLICATION_PROCESS=LOG_DATA_01:::P6_FIELD1:-99.9"
        data += " HTTP/1.1\r\n"
        data += "Host: " + APEXServer + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from APEX.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        APEXMessageSent = true
        return
    }
}
