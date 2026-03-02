from flask import Flask, jsonify
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app)

# 最後に実行した時間
last_executed_time = 0
# インターバル（秒）
INTERVAL = 5  # テスト用に10秒に設定

@app.route('/get_command', methods=['GET'])
def get_command():
    global last_executed_time
    current_time = time.time()

    if current_time - last_executed_time > INTERVAL:
        last_executed_time = current_time
        
        # 0〜4の範囲でランダムな座標を生成（サイズに合わせて変更してください）
        target_x = random.randint(0, 9)
        target_y = random.randint(0, 0)
        
        print(f"ハイライト指示送信: ({target_x}, {target_y})")
        
        # JSONで指示を送る
        return jsonify({
            "command": "highlight",
            "x": target_x,
            "y": target_y
        })

    return jsonify({"command": "idle"})

if __name__ == '__main__':
    app.run(port=5000)