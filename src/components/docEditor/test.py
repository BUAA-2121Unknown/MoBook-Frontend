with open('./AtBox.vue', 'r') as input_file, open('AtBoxx.txt', 'w') as output_file:
    # 读取输入文件的内容
    input_string = input_file.read()

    # 处理字符串，删除U+00a0和换行符
    processed_string = input_string.replace('\u00a0', '').replace('\n', '')

    # 将处理后的结果写入输出文件
    output_file.write(processed_string)