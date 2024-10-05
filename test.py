# 转换url %编码
import urllib.parse
# url = 'https%3A%2F%2Foffline-download.hupu.com%2Fonline%2Fprod%2F310016%2Fdetail.html%3FoutBizType%3Dlol%26outBizNo%3D1%26offlineSupport%3D0&nativeSchema=huputiyu%3A%2F%2Fscore%2Fdetail%3FoutBizType%3Dlol%26outBizNo%3D1'
#url = 'https%3A%2F%2Fm.hupu.com%2Fscore%2Fcreate.html%3FoutBizNo%3D1%26outBizType%3Dlol%26selfCategory%3Dlol%26parentNodeId%3D1458935%26edit%3D1'
url = 'https%3A%2F%2Foffline-download.hupu.com%2Fonline%2Fprod%2F310016%2Fdetail.html%3FoutBizType%3Dlol_item%26outBizNo%3D24441&nativeSchema=huputiyu%3A%2F%2Fscore%2Fdetail%3FoutBizType%3Dlol_item%26outBizNo%3D24441'
print(urllib.parse.unquote(url))