---
title: "{{ replace .Name "-" " " | title }}"
subtitle: ""
description: ""
authors: []
tags: []
categories: []
series: []

slug: "{{ replaceRE `^[^\/]+\/(.*)` "$1" (replace (path.Dir .Path) "\\" "/") }}/{{ .Name }}"
# private: true
date: {{ .Date }}
# lastmod: {{ .Date }}
draft: true
---

