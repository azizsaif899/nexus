import { GoogleAuth } from 'google-auth-library';

export class GoogleAuthConfig {
  private static instance: GoogleAuth;

  static getInstance(): GoogleAuth {
    if (!this.instance) {
      this.instance = new GoogleAuth({
        credentials: {
          type: 'service_account',
          project_id: 'gen-lang-client-0147492600',
          private_key_id: 'd2d921eea64dd9890575ed4cb0d1af1b233a3e89',
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD5PDVq8unLkAgX
dKsHNS7CVZG3mzqLYxjj/1Hg9optc5nPtcwbN1t79tXn7l1kSsEZjQffxwMwEtDE
7dl2YyHOV63j/GSQkCMXEOirGVPxcsaRijmNC4WpB3+lBl7D7nYDN+8SjL5cCc69
gPzH5XydOl2zd6AQObUGCNTIog4uoBvQ56pxeH6FtfsStykCG8N61YIZBRQ++y9R
oCwSP9W7UeosuwTJWre/4+O3rU3Eb1vh2Ml25ummZlVjmxyX3fQZZKDKIWCaNRjz
LhHU04OwyLWFQ4gzvLSA/dd0EYsaNWMW8vQ2xeSt+O2Um+y/f1Pj+FOjTF0NPsBM
H341e099AgMBAAECggEALvUIjW9Z3Cf1VlH9XRzIhAWyMBkXdSaFDIPQreVVXFzA
2HEElQYffuIZGBsBToGFEybOmns43whUfB3h8FuqBWHgmck2O0Rk0BY39/CML7vz
rH0R7cCDfL60bmeeWCTn6CBUMzcAMIAKiwqv1YunqEnUWJlLt3Lf59SnHmvl5yOV
GpYr/qmhcz+EW6lNMbk914rtNRBiu/b5P2SlpsHekvOqISVbCHZ1qDenUtsR9CrR
Hha0bainNmPQl5eDDcQqzcJfxUcYrMHHuZkh7gvdlD8z+iAtpzlVWi5lZ2jrEbk1
A4SEsq4LoJi+bxj/TH5MYqFWE8LmHjuSpHROS+kuQwKBgQD+0MQgIqZ/f7IaPGZK
B/3vu4EhrHk7H80j1RVfiegia/wrowzjGSu8+p63aGoa6zayYTAyzaR9arqkOfcA
U7h+4m0gqzFOdWtJNYBGk+8anEDboydnRviCKIDbY/I9A2RvCTSmbTXS2dnIIXRD
ZtgACtfD2J9G0o30nJrfPHSuewKBgQD6ZM1KH0RGGTmTCyE4Jhz3IfNcrpGDLS4/
b4YqCkaG1MHAOJq2I80I4CzU7jFskGl40C71V0pDM6LW5gddyXG2UVM2Rv8fvLhi
xWekulxD12zCRZ/xYDp5/O/P79rq+OyImb3tGwR353/QIG6SAE78quir9ztRO4QW
cAuTrd6UZwKBgQD6Sitq+T4b3F0fwhYjP4hhkwa7AcOunIUOXj35Mudt8C2o2yZM
Zyv8GxwNQSV/vWxjeG00aaPZgR1FNJ52lsWQ9G2GekEbNOCl70RJjwN8WuCmHLMW
kbKFfq1bUefdoFhlbGBn3LvSmSN+ncWqcvlVyVC4US3aDfVbwPuqrKJbwwKBgFHk
SefmFfQ/J79ZsoGkpXCGIAu95EVcr3V7ygtR1QMf7kYpvR+40cQHXWI+jNeO24/x
tonzBIy6BJX4IYyg55nTOz3TNnlwxXU4Ts9nS+m8OQvIrajJ6hYfjWcacSTMSL/c
WGuFnI6CniC5mrARfcPROcuUTkghCPA1sPOZt+QdAoGAdpVNhqY8C4G4UJ+9wElz
l6LehsT23AsHsx7tQofVzRguuNn/eioG7QVlrOQB5HjGza7nBOHviSuap4ydNb15
jaDlJepGMK+Xe2bRtrVxAZiWj+CWYPsIM+7gc5zByuqamZW5tqHLQe5//JHI/jrj
bgt3vC96CujpfXZQ9Ml5HBc=
-----END PRIVATE KEY-----`,
          client_email: 'workflows-service@gen-lang-client-0147492600.iam.gserviceaccount.com',
          client_id: '107879305191926995063'
        },
        scopes: [
          'https://www.googleapis.com/auth/cloud-platform',
          'https://www.googleapis.com/auth/workflows',
          'https://www.googleapis.com/auth/spreadsheets'
        ]
      });
    }
    return this.instance;
  }
}