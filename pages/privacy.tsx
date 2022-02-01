import { Heading, Text } from "@chakra-ui/react";
import Link from "../components/Link";
import { SiteContainer } from "../components/SiteContainer";

const PrivacyPolicy = () => <SiteContainer>
  <Heading as="h1">Privacy Policy</Heading>
  <Text>I take your privacy seriously. To better protect your privacy I provide this privacy policy notice explaining
    the way your personal information is collected and used.</Text>

  <Heading as="h2" size="md">Collection of Routine Information</Heading>

  <Text>This website tracks basic information about visitors. This information includes, but is not limited to,
    IP addresses, browser details, timestamps and referring pages. None of this information can personally identify
    specific to visitors of this website. The information is tracked for routine administration and maintenance purposes.</Text>

  <Heading as="h2" size="md">Cookies</Heading>

  <Text>Where necessary, this website uses cookies to store information about a visitor&apos;s preferences and history in
    order to better serve the visitor and/or present the visitor with customized content.</Text>

  <Heading as="h2" size="md">Advertisement and Other Third Parties</Heading>

  <Text>Advertising partners and other third parties may use cookies, scripts and/or web beacons to track visitors&apos;
    activities on this website in order to display advertisements and other useful information. Such tracking is done directly
    by the third parties through their own servers and is subject to their own privacy policies. This website has no access or control
    over these cookies, scripts and/or web beacons that may be used by third parties. Learn how to
    <Link href="http://www.google.com/privacy_ads.html">opt out of Google&apos;s cookie usage</Link>.</Text>

  <Heading as="h2" size="md">Links to Third Party Websites</Heading>

  <Text>I have included links on this website for your use and reference. I am not responsible
    for the privacy policies on these websites. You should be aware that the privacy policies of these websites may differ
    from my own.</Text>

  <Heading as="h2" size="md">Storage and Transmission of Sensitive Data</Heading>

  <Text>This website does not permanently store any personal information in itself. In particular, I do not permanently store your financial information,
    such as account numbers, balances or transactions.  Transactions are stored temporarily while being loaded from your bank, processed by this website
    and finally sent to YNAB for import and storage.</Text>
  <Text>Data obtained from YNAB and your bank is transmitted over encrypted channels and will never be sent to any third party (other than YNAB)</Text>

  <Heading as="h2" size="md">Security</Heading>

  <Text>The security of your personal information is important to me, but remember that no method of transmission
    over the Internet, or method of electronic storage, is 100% secure. While I strive to use commercially acceptable
    means to protect your personal information, I cannot guarantee its absolute security.</Text>

  <Heading as="h2" size="md">Changes To This Privacy Policy</Heading>

  <Text>This Privacy Policy is effective as of 2022-02-01 and will remain in effect except with respect to any changes in its
    provisions in the future, which will be in effect immediately after being posted on this page.</Text>

  <Text>I reserve the right to update or change my Privacy Policy at any time and you should check this
    Privacy Policy periodically. If I make any material changes to this Privacy Policy, I will
    notify you either through the email address you have provided me, or by placing a prominent notice on
    this website.</Text>

  <Heading as="h2" size="md">Contact Information</Heading>

  <Text>For any questions or concerns regarding this privacy policy, please send me an email at emil.styrke@gmail.com.</Text>
</SiteContainer>

export default PrivacyPolicy;