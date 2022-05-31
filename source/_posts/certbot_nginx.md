---

title: cerbot_nginx
date: 2022-05-12 12:22:14
tags: docker nginx vps
categories: 琐
description: -- docker下的证书自动续期与代理
top_img: http://qiniu.cetacean.top/pic/2022523210518hv4oqon6wy.pngdocker-nginx-cerbot.png
cover: http://qiniu.cetacean.top/pic/2022523210518hv4oqon6wy.pngdocker-nginx-cerbot.png
copyright_author: CETACEAN
copyright_author_href: github.com/cetaceanMercuries
copyright_url: https://blog.cetacean.top/cerbot_nginx
copyright_info: FROM CETACEAN

---

## 脚本

```bash
git clone https://github.com/wangy8961/certbot-dns-aliyun.git
cp certbot-dns-aliyun/certbot-dns-aliyun /etc/letsencrypt/
```

在`/et/letsencrypt/`目录下创建`config.json`文件

```json
{
    "accessKeyID": "你的AccessKeyID",
    "accessKeySecret": "你的AccessKeySecret"
}
```

## 申请

```bash
certbot certonly \
  --non-interactive \
  --email xxx@xx.com \
  --agree-tos \
  --manual-public-ip-logging-ok \
  --manual --preferred-challenges dns-01 \
  --manual-auth-hook "/etc/letsencrypt/certbot-dns-aliyun -o authenticator" \
  --manual-cleanup-hook "/etc/letsencrypt/certbot-dns-aliyun -o cleanup" \
  -d *.example.com -d example.com \
  --server https://acme-v02.api.letsencrypt.org/directory
```

## 自动续期

```bash
crontab -e
# 添加
/usr/bin/certbot renew --manual --preferred-challenges dns-01 --manual-auth-hook "/etc/letsencrypt/certbot-dns-aliyun -o authenticator" --manual-cleanup-hook "/etc/letsencrypt/certbot-dns-aliyun -o cleanup" --deploy-hook "docker restart nginx"
```

## nginx

```bash
docker run --detach \
        --restart always \
        --name nginx \
        -p 443:443 \
        -p 80:80 \
        -v /home/nginx/www:/usr/share/nginx/html:rw \
        -v /home/nginx/conf.d/:/etc/nginx/conf.d/:rw \
        -v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf:rw \
        -v /home/nginx/logs:/var/log/nginx/:rw \
        -v /etc/letsencrypt/:/etc/nginx/ssl/:rw \
        -d nginx
```

### 配置

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
	include       /etc/nginx/mime.types;
	default_type  application/octet-stream;

	log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

	access_log  /var/log/nginx/access.log  main;

	sendfile        on;
	#tcp_nopush     on;

	keepalive_timeout  65;

	server {
		listen 80;
		server_name *.cetacean.top;
		return 301 https://$http_host$request_uri;
	}

	server {
		listen 443 ssl;                                                          # https对应端口，
		ssl_certificate /etc/nginx/ssl/live/cetacean.top/fullchain.pem;
		ssl_certificate_key /etc/nginx/ssl/live/cetacean.top/privkey.pem;
		server_name *.cetacean.top;                                             # ip，域名，我这里以泛域名举例，毕竟是做反向代理，http就不用配置了

		location / {
			proxy_pass  http://172.17.0.1:8080;  # 映射的frp服务端frps.ini的 vhost_http_port端口
        			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        			proxy_set_header Host $http_host;
        			proxy_set_header X-NginX-Proxy true;
        			proxy_http_version 1.1;
        			proxy_set_header Upgrade $http_upgrade;
        			proxy_set_header Connection "upgrade";
        			proxy_max_temp_file_size 0;
        			proxy_redirect off;
        			proxy_read_timeout 240s;
    		}
        		error_page   500 502 503 504  /50x.html; 
  		location = /50x.html {
        			root   /usr/share/nginx/html;
    		}
	}
	
}
```
