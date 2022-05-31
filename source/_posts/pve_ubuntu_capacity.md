---

title: pve_ubuntu_capacity
date: 2022-04-25 19:17:12
tags: NAS Linux
categories: 琐
description: -- PVE下ubuntu的扩容
top_img: https://cdn.jsdelivr.net/gh/cetaceanMercurius/Images@master/blog/capcity.png
cover: https://cdn.jsdelivr.net/gh/cetaceanMercurius/Images@master/blog/capcity.png
copyright_author: CETACEAN
copyright_author_href: github.com/cetaceanMercuries
copyright_url: https://blog.cetacean.top/pve_ubuntu_capacity
copyright_info: FROM CETACEAN

---

## 调整磁盘大小

PVE管理页面选择硬件-硬盘，并添加所需容量大小

![image-20220425193446626](http://qiniu.cetacean.top/typora/image-20220425193446626.png)

## 扩容

```bash
lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
```

## resize

```bash
resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```

