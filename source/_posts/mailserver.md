---

title: mailserver
date: 2022-04-25 19:17:12
tags: docker 通讯
categories: 琐
description: -- 邮件服务器
top_img: https://pic.imgdb.cn/item/629638590947543129d674e8.png
cover: https://pic.imgdb.cn/item/629638590947543129d674e8.png
copyright_author: CETACEAN
copyright_author_href: github.com/cetaceanMercuries
copyright_url: https://blog.cetacean.top/mailserver
copyright_info: FROM CETACEAN

---

服务源于[docker-mailserver](https://github.com/docker-mailserver/docker-mailserver)

```shell
git clone https://github.com/docker-mailserver/docker-mailserver.git
# 所需文件
- docker-compose.yml 容器部署文件
- setup.sh 服务配置脚本
```

编辑docker-compose.yml

```docker
version: '3.8'

services:
  mailserver:
    image: docker.io/mailserver/docker-mailserver:latest
    container_name: mailserver
    hostname: mail
    # 更改为自己的域名
    domainname: cetacean.top
    ports:
      - "25:25"
      - "193:193"
      - "993:993"
      - "587:587"
      - "465:465"
    volumes:
      - /home/dms/mail-data/:/var/mail/
      - /home/dms/mail-state/:/var/mail-state/
      - /home/dms/mail-logs/:/var/log/mail/
      - /home/dms/config/:/tmp/docker-mailserver/
      # ssl证书
      - /etc/letsencrypt/:/etc/letsencrypt/
      - /etc/localtime:/etc/localtime:ro
    environment:
      - ENABLE_FAIL2BAN=1
      # 可选ssl证书类型
      - SSL_TYPE=letsencrypt
      - PERMIT_DOCKER=network
      - ONE_DIR=1
      - ENABLE_POSTGREY=0
      - ENABLE_CLAMAV=0
      - ENABLE_SPAMASSASSIN=0
      - SPOOF_PROTECTION=0
    cap_add:
      - NET_ADMIN
      - SYS_PTRACE
```

## 开放端口

```shell
ufw allow 25
ufw allow 193
ufw allow 993
ufw allow 465
ufw allow 587
```

## 添加DNS解析

| 类型 | 记录名 | 记录值                                                       |
| ---- | ------ | ------------------------------------------------------------ |
| A    | mail   | xxx.xxx.xxx.xxx(自己服务器的ip)                              |
| MX   | @      | mail.example.com(mail.<域名>); 优先级选10                    |
| TXT  | @      | v=spf1 mx ~all                                               |
| TXT  | _dmarc | v=DMARC1; p=quarantine; rua=mailto:dmarc.report@example.com; ruf=mailto:dmarc.report@example.com; fo=0; adkim=r; aspf=r; pct=100; rf=afrf; ri=86400; sp=quarantine(内有两个需要改为自己的域名) |

## 使用certbot申请证书

```shell
apt install -y certbot
certbot certonly --manual --preferred-challenge dns -d  mail.example.com
```

## 验证

使用dig验证解析是否生效

```shell
apt-get install dnsutils
dig TXT _acme-challenge.mail.example.com
```

![image-20220425182503108](http://qiniu.cetacean.top/typora/image-20220425182503108.png)

## 配置续签证书

```shell
crontab -e
# 添加如下
0 5 * * 1 /usr/bin/certbot renew --quiet
```

## 部署

```shell
docker-compose up -d
docker-compose logs -f # 查看容器日志
```

## 创建user

```shell
./setup.sh email add admin@example.com "xxx" # 添加账号密码
# 其他功能参见help
./setup.sh help
```

## 生成DKIM签名记录

```shell
./setup.sh config dkim keysize 2048
cat config/opendkim/keys/example.com/mail.txt
# 截取格式如下
v=DKIM1;h=sha256;k=rsa;p=xxx
```

同样添加到DNS解析中

| 类型 | 记录名          | 记录值                       |
| ---- | --------------- | ---------------------------- |
| TXT  | mail._domainkey | v=DKIM1;h=sha256;k=rsa;p=xxx |

## ssl验证测试

[测试是否以加上证书](https://www.checktls.com/)

![image-20220425183254464](http://qiniu.cetacean.top/typora/image-20220425183254464.png)

## 客户端安装

[eM Client](https://www.emclient.com/)

下载安装并添加账号

![image-20220425183438301](http://qiniu.cetacean.top/typora/image-20220425183438301.png)