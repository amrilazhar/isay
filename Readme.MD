# __Isay Web API__

## __About The Apps__

i-Say is a social media platform which let you follow your interests and connect to people with similar interests anonymously without worrying your privacy online. Privacy is an important aspect in a world where everything is connected with the internet and we offer anonymity to be the uttermost feature in our platform.

Nowadays most social media platform has some problems related to privacy or anonymity, and social media platforms which offer full anonymity aren’t common. We create a platform where people can follow their interests, create posts and talk to new people with similar interests anonymously and we make sure that your personal information is safe and we don’t store your personal information other than your e-mail.

 ### __Basic Feature__ :
1. Generate Profile Based on Your Interests : When user create their first profile, it will be automatically generated based on your interests that you want to follow. Your name and profile picture are a reflection of your interests so people with similar interests will find it easier to relate!

2. Create Post : User can create posts or with media such as images anonymously and choose what kind of post they want to share based on interest. 

3. Browse Posts per Interest : User can view and search other users’ posts per interest. Here user can ask other users for random question or answer questions from other people. You can also give likes to questions and answers submitted by users.

4. Chat with Other People : Chat anonymously with other people especially with other user with same interest. But be careful not to share your personal information with others!

## __Usage__

If you want to use this API, you need some requirement :

1. MongoDB Database
2. Cloud Server / Hosting that support NodeJS
3. Amazon S3 Bucket
4. Mailgun (for sending verification email)
5. Firebase Account (for push notificatio in mobile)
6. Google Cloud Platform (for Google Login, and Signup)

This is the configuration in env.**** file :

```
MONGO_URI = << mongo db url>>
S3_ACCESS_KEY = << S3 secret key >>
S3_SECRET_KEY = << S3 secret key >>
S3_BUCKET_NAME = << Bucket Name >>
S3_URL = << S3 Bucket URL >>
SERVER_URI= << server url >>
JWT_SECRET= << your secret string>>
GOOGLE_CLIENT_ID= << Google Cloud Client ID>>
MAILGUN_API_KEY= << your Mailgun key>>
MAILGUN_DOMAIN= << your Mailgun domain>>
GOOGLE_ACCOUNT_KEY= << firebase secretAccKey JSON >>
```


## __Full Documentation__
Postman Documentation Link : https://bit.ly/isay-docs

## __Explanation About The App__
1. Video Promotion Link : https://bit.ly/isay-promote
2. Video Explanation Link : https://bit.ly/isay-video
3. Presentation Link : https://bit.ly/isay-presentation
4. Web Demo Link : https://isaybatch11.herokuapp.com
5. APK Link : https://bit.ly/isay-apk8