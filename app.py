from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import joblib
import numpy as np
import openai
from wordcloud import WordCloud
# import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import jieba
import matplotlib
import os

app = Flask(__name__)

# 配置数据库
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost/health_management_system'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 用户模型
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# 健康数据模型
class HealthData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    male = db.Column(db.Integer, nullable=False)
    currentSmoker = db.Column(db.Integer, nullable=False)
    cigsPerDay = db.Column(db.Integer, nullable=False)
    BPMeds = db.Column(db.Integer, nullable=False)
    diabetes = db.Column(db.Integer, nullable=False)
    totChol = db.Column(db.Float, nullable=False)
    sysBP = db.Column(db.Float, nullable=False)
    diaBP = db.Column(db.Float, nullable=False)
    BMI = db.Column(db.Float, nullable=False)
    heartRate = db.Column(db.Float, nullable=False)
    glucose = db.Column(db.Float, nullable=False)
    risk = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# 健康数据匿名化模型
class HealthDataAnonymized(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    male = db.Column(db.Integer, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    currentSmoker = db.Column(db.Integer, nullable=False)
    cigsPerDay = db.Column(db.Integer, nullable=False)
    BPMeds = db.Column(db.Integer, nullable=False)
    diabetes = db.Column(db.Integer, nullable=False)
    totChol = db.Column(db.Float, nullable=False)
    sysBP = db.Column(db.Float, nullable=False)
    diaBP = db.Column(db.Float, nullable=False)
    BMI = db.Column(db.Float, nullable=False)
    heartRate = db.Column(db.Float, nullable=False)
    glucose = db.Column(db.Float, nullable=False)
    risk = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# 加载模型和特征缩放器
model = joblib.load('logistic_regression_model.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    # 检查邮箱是否已存在
    if User.query.filter_by(email=email).first():
        return jsonify({'message': '邮箱已存在'}), 400

    # 检查用户名是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({'message': '用户名已存在'}), 400

    # 创建新用户
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')  # 修改为 pbkdf2:sha256
    new_user = User(username=username, password=hashed_password, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/predict', methods=['POST'])
def predict():
    print("predict")
    data = request.get_json()

    try:
        features = np.array([
            data['male'],
            data['age'],
            data['currentSmoker'],
            data['cigsPerDay'],
            data['BPMeds'],
            data['diabetes'],
            data['totChol'],
            data['sysBP'],
            data['diaBP'],
            data['BMI'],
            data['heartRate'],
            data['glucose']
        ]).reshape(1, -1)
        print(features)
    except (ValueError, TypeError) as e:
        return jsonify({'error': f'Invalid data format: {e}'}), 400
    print(features)
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    risk = 'High' if prediction[0] == 1 else 'Low'

    user = User.query.filter_by(username=data['username']).first()
    print(user)
    if not user:
        print("user not found")
        return jsonify({'error': 'User not found'}), 404

    new_health_data = HealthData(
        user_id=user.id,
        age=data['age'],
        male=data['male'],
        currentSmoker=data['currentSmoker'],
        cigsPerDay=data['cigsPerDay'],
        BPMeds=data['BPMeds'],
        diabetes=data['diabetes'],
        totChol=data['totChol'],
        sysBP=data['sysBP'],
        diaBP=data['diaBP'],
        BMI=data['BMI'],
        heartRate=data['heartRate'],
        glucose=data['glucose'],
        risk=1 if prediction[0] == 1 else 0
    )
    db.session.add(new_health_data)
    db.session.commit()

    return jsonify({'risk': risk})

@app.route('/get_history', methods=['POST'])
def get_history():
    data = request.get_json()
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    health_data = HealthData.query.filter_by(user_id=user.id).all()
    if not health_data:
        return jsonify({'error': 'No health data found for this user'}), 404

    history = []
    for item in health_data:
        history.append({
            'date': item.created_at.strftime('%Y-%m-%d'),
            'age': item.age,
            'male': item.male,
            'currentSmoker': item.currentSmoker,
            'cigsPerDay': item.cigsPerDay,
            'BPMeds': item.BPMeds,
            'diabetes': item.diabetes,
            'totChol': item.totChol,
            'sysBP': item.sysBP,
            'diaBP': item.diaBP,
            'BMI': item.BMI,
            'heartRate': item.heartRate,
            'glucose': item.glucose,
            'risk': 'High' if item.risk == 1 else 'Low'
        })
    print(history)
    return jsonify({'history': history})

# 配置OpenAI客户端
class AIClient:
    def __init__(self):
        self.client = openai.OpenAI(
            api_key="sk-xxxxxxxxxxxx",
            base_url="https://www.dmxapi.cn/v1"
        )
    
    def generate_response(self, messages, max_retries=3):
        for attempt in range(max_retries):
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=500
                )
                return response.choices[0].message.content.strip()
            except openai.APIError as e:
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt
                    time.sleep(wait_time)
                    continue
                raise e

ai_client = AIClient()

# AI对话记录模型
class AIChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# 新增路由
@app.route('/ask_ai', methods=['POST'])
def ask_ai():
    # 验证用户
    data = request.get_json()
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    # 验证问题内容
    question = data.get('question', '').strip()
    if not question or len(question) > 500:
        return jsonify({'error': '无效的问题内容'}), 400

    try:
        # 构造对话上下文
        messages = [
            {
                "role": "system",
                "content": "你是一位专业健康顾问，用中文回答用户的健康问题。回答需满足："
                           "1. 基于医学共识 2. 给出实用建议 3. 语言简洁易懂"
            },
            {
                "role": "user",
                "content": question
            }
        ]

        # 获取AI回复
        answer = ai_client.generate_response(messages)
        
        # 保存对话记录
        chat_record = AIChatHistory(
            user_id=user.id,
            question=question,
            answer=answer
        )
        db.session.add(chat_record)
        db.session.commit()

        return jsonify({'question': question, 'answer': answer})

    except openai.APIError as e:
        return jsonify({'error': f'AI服务暂时不可用: {str(e)}'}), 503
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'服务器错误: {str(e)}'}), 500



@app.route('/wordcloud', methods=['GET'])
def generate_wordcloud():
    try:
        with open('cn_stopwords.txt', encoding='utf-8') as f:
            STOPWORDS = set([line.strip() for line in f])
        # 从数据库取所有历史问题文本
        records = AIChatHistory.query.with_entities(AIChatHistory.question).all()
        text = ' '.join([r[0] for r in records])
        
        # 分词且去停用词
        seg_list = jieba.cut(text)
        filtered_words = [w for w in seg_list if w.strip() and w not in STOPWORDS]
        print(filtered_words)
        segmented_text = ' '.join(filtered_words)

        # 生成词云
        wc = WordCloud(font_path='msyh.ttc', width=800, height=600, background_color='white')
        wc.generate(segmented_text)
        image_path = './static/wordcloud.png'
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        wc.to_file(image_path)

        # 调用大模型接口做简要分析（用词云文本做提示）
        messages = [
            {
                "role": "system",
                "content": "你是一位专业健康顾问，帮我总结以下关键词的健康相关分析，简洁明了。"
            },
            {
                "role": "user",
                "content": segmented_text
            }
        ]
        analysis = ai_client.generate_response(messages)

        return jsonify({
            'image_url': '/static/wordcloud.png',
            'analysis': analysis
        })

    except Exception as e:
        return jsonify({'error': f'生成词云失败: {str(e)}'}), 500


# 获取对话历史
@app.route('/ai_history', methods=['POST'])
def get_ai_history():
    data = request.get_json()
    username = data.get('username')
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    records = AIChatHistory.query.filter_by(user_id=user.id).order_by(AIChatHistory.created_at.desc()).limit(20).all()
    
    history = [{
        "id": r.id,
        "question": r.question,
        "answer": r.answer,
        "time": r.created_at.strftime('%Y-%m-%d %H:%M')
    } for r in records]

    return jsonify({'history': history})

@app.route('/clear_ai_history', methods=['POST'])
def clear_ai_history():
    data = request.get_json()
    username = data.get('username')
    
    # 验证用户是否存在
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    try:
        # 删除该用户所有AI对话记录
        deleted_count = AIChatHistory.query.filter_by(user_id=user.id).delete()
        db.session.commit()
        return jsonify({
            'message': f'成功删除 {deleted_count} 条对话记录',
            'status': 'success'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': f'清空记录失败: {str(e)}',
            'status': 'error'
        }), 500

# 新增数据分析接口
@app.route('/analysis/summary', methods=['GET'])
def get_data_summary():
    try:
        # 基础统计
        total = HealthDataAnonymized.query.count()
        high_risk_count = HealthDataAnonymized.query.filter_by(risk=1).count()
        avg_age = db.session.query(db.func.avg(HealthDataAnonymized.age)).scalar() or 0
        smoker_ratio = HealthDataAnonymized.query.filter(HealthDataAnonymized.currentSmoker == 1).count() / total if total else 0
        
        response = jsonify({
            "status": "success",
            "data": {
                "total": total,
                "high_risk_ratio": round(high_risk_count / total * 100, 2) if total else 0,
                "avg_age": round(avg_age, 1),
                "smoker_ratio": round(smoker_ratio * 100, 2)
            }
        })
        print("response:",response.data)
        return response
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/risk_distribution', methods=['GET'])
def get_risk_distribution():
    try:
        # 风险分布（性别维度）
        gender_data = db.session.query(
            HealthDataAnonymized.male,
            db.func.count().label('total'),
            db.func.avg(HealthDataAnonymized.risk).label('risk_avg')
        ).group_by(HealthDataAnonymized.male).all()
        
        # 风险分布（年龄分段）
        age_ranges = [(19,30), (31,40),(41,50),(51,60),(61,100)]
        age_data = []
        for min_age, max_age in age_ranges:
            count = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.age >= min_age,
                HealthDataAnonymized.age <= max_age
            ).count()
            age_data.append({
                "range": f"{min_age}-{max_age}",
                "count": count
            })
        # print(age_data)
            
        return jsonify({
            "status": "success",
            "data": {
                "by_gender": [{"gender": "男" if g[0]==1 else "女", "count": g[1], "risk_avg": float(g[2])} for g in gender_data],
                "by_age": age_data
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/indicators', methods=['GET'])
def get_key_indicators():
    try:
        # 关键指标统计
        indicators = db.session.query(
            db.func.avg(HealthDataAnonymized.BMI).label('avg_bmi'),
            db.func.avg(HealthDataAnonymized.sysBP).label('avg_sys_bp'),
            db.func.avg(HealthDataAnonymized.diaBP).label('avg_dia_bp'),
            db.func.avg(HealthDataAnonymized.glucose).label('avg_glucose')
        ).first()
        
        return jsonify({
            "status": "success",
            "data": {
                "avg_bmi": round(indicators.avg_bmi, 1) if indicators.avg_bmi else 0,
                "avg_sys_bp": round(indicators.avg_sys_bp, 1) if indicators.avg_sys_bp else 0,
                "avg_dia_bp": round(indicators.avg_dia_bp, 1) if indicators.avg_dia_bp else 0,
                "avg_glucose": round(indicators.avg_glucose, 1) if indicators.avg_glucose else 0
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/bmi_distribution', methods=['GET'])
def get_bmi_distribution():
    try:
        # BMI区间分布
        categories = [
            ("偏瘦", 0, 18.5),
            ("正常", 18.5, 25),
            ("过重", 25, 30),
            ("肥胖", 30, 100)
        ]
        
        distribution = []
        for label, min_val, max_val in categories:
            count = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.BMI >= min_val,
                HealthDataAnonymized.BMI < max_val
            ).count()
            distribution.append({"category": label, "count": count})
            
        return jsonify({
            "status": "success",
            "data": distribution
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/correlation', methods=['GET'])
def get_factor_correlation():
    try:
        # 风险因素相关性分析
        data = db.session.query(
            db.func.corr(HealthDataAnonymized.BMI, HealthDataAnonymized.risk).label('bmi_corr'),
            db.func.corr(HealthDataAnonymized.sysBP, HealthDataAnonymized.risk).label('sys_bp_corr'),
            db.func.corr(HealthDataAnonymized.glucose, HealthDataAnonymized.risk).label('glucose_corr')
        ).first()
        
        return jsonify({
            "status": "success",
            "data": {
                "bmi_corr": round(data.bmi_corr, 2) if data.bmi_corr else 0,
                "sys_bp_corr": round(data.sys_bp_corr, 2) if data.sys_bp_corr else 0,
                "glucose_corr": round(data.glucose_corr, 2) if data.glucose_corr else 0
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 新增年龄分布接口
@app.route('/analysis/age_distribution', methods=['GET'])
def get_age_distribution():
    try:
        # 定义年龄分段
        age_ranges = [
            (0, 18, '0-18'),
            (19, 30, '19-30'),
            (31, 50, '31-50'),
            (51, 100, '51+')
        ]
        
        results = []
        for min_age, max_age, label in age_ranges:
            count = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.age >= min_age,
                HealthDataAnonymized.age <= max_age
            ).count()
            results.append({
                "age_group": label,
                "count": count
            })
            
        return jsonify({
            "status": "success",
            "data": results
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/analysis/smoking_distribution', methods=['GET'])
def get_smoking_distribution():
    try:
        # 只针对吸烟者统计每日吸烟根数分布
        bins = [
            (1, 5, '1-5根'),
            (6, 10, '6-10根'),
            (11, 20, '11-20根'),
            (21, 40, '21-40根'),
            (41, 100, '40根以上')
        ]

        results = []
        for min_val, max_val, label in bins:
            count = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.currentSmoker == 1,
                HealthDataAnonymized.cigsPerDay >= min_val,
                HealthDataAnonymized.cigsPerDay <= max_val
            ).count()
            results.append({
                "label": label,
                "count": count
            })

        return jsonify({"status": "success", "data": results})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/analysis/diabetes_risk', methods=['GET'])
def get_diabetes_risk():
    try:
        diabetic_high_risk = HealthDataAnonymized.query.filter_by(diabetes=1, risk=1).count()
        diabetic_total = HealthDataAnonymized.query.filter_by(diabetes=1).count()

        return jsonify({
            "status": "success",
            "data": {
                "label":["糖尿病总人数","糖尿病高风险人数"],
                "data":[diabetic_total,diabetic_high_risk],
                "diabetic_total": diabetic_total,
                "diabetic_high_risk": diabetic_high_risk,
                "risk_ratio": round(diabetic_high_risk / diabetic_total * 100, 2) if diabetic_total else 0
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/bmi_by_gender', methods=['GET'])
def get_bmi_by_gender():
    try:
        genders = [(0, "女"), (1, "男")]
        bmi_data = []

        for gender_val, gender_label in genders:
            avg_bmi = db.session.query(db.func.avg(HealthDataAnonymized.BMI)).filter_by(male=gender_val).scalar()
            bmi_data.append({
                "gender": gender_label,
                "avg_bmi": round(avg_bmi, 1) if avg_bmi else 0
            })

        return jsonify({
            "status": "success",
            "data": bmi_data
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/hypertension_risk', methods=['GET'])
def get_hypertension_risk():
    try:
        high_bp_risk = HealthDataAnonymized.query.filter(
            HealthDataAnonymized.sysBP >= 140,
            HealthDataAnonymized.risk == 1
        ).count()
        high_bp_total = HealthDataAnonymized.query.filter(HealthDataAnonymized.sysBP >= 140).count()

        return jsonify({
            "status": "success",
            "data": {
                "high_bp_total": high_bp_total,
                "high_bp_high_risk": high_bp_risk,
                "risk_ratio": round(high_bp_risk / high_bp_total * 100, 2) if high_bp_total else 0
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/indicators_by_risk', methods=['GET'])
def get_indicators_by_risk():
    try:
        results = []
        for risk_level in [0, 1]:
            avg_bmi = db.session.query(db.func.avg(HealthDataAnonymized.BMI)).filter_by(risk=risk_level).scalar()
            avg_bp = db.session.query(db.func.avg(HealthDataAnonymized.sysBP)).filter_by(risk=risk_level).scalar()
            avg_glucose = db.session.query(db.func.avg(HealthDataAnonymized.glucose)).filter_by(risk=risk_level).scalar()
            
            results.append({
                "risk_level": "高风险" if risk_level == 1 else "低风险",
                "avg_bmi": round(avg_bmi, 1) if avg_bmi else 0,
                "avg_sys_bp": round(avg_bp, 1) if avg_bp else 0,
                "avg_glucose": round(avg_glucose, 1) if avg_glucose else 0
            })

        return jsonify({"status": "success", "data": results})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/smoking_vs_hypertension', methods=['GET'])
def smoking_vs_hypertension():
    try:
        ranges = [
            (1, 5, "1-5根"),
            (6, 10, "6-10根"),
            (11, 20, "11-20根"),
            (21, 40, "21-40根"),
            (41, 999, "40根以上")
        ]
        
        result = []

        for low, high, label in ranges:
            total = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.currentSmoker == 1,
                HealthDataAnonymized.cigsPerDay >= low,
                HealthDataAnonymized.cigsPerDay <= high
            ).count()

            high_bp = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.currentSmoker == 1,
                HealthDataAnonymized.cigsPerDay >= low,
                HealthDataAnonymized.cigsPerDay <= high,
                HealthDataAnonymized.sysBP >= 140
            ).count()

            ratio = round(high_bp / total * 100, 2) if total else 0

            result.append({
                "smoking_level": label,
                "hypertension_rate": ratio
            })

        return jsonify({"status": "success", "data": result})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/analysis/bmi_risk_relation', methods=['GET'])
def bmi_risk_relation():
    try:
        # BMI 分类区间（WHO 标准）
        bmi_ranges = [
            ("偏瘦", 0, 18.5),
            ("正常", 18.5, 24.9),
            ("过重", 25, 29.9),
            ("肥胖", 30, 100)
        ]
        
        result = []
        for label, min_bmi, max_bmi in bmi_ranges:
            total = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.BMI >= min_bmi,
                HealthDataAnonymized.BMI < max_bmi
            ).count()
            
            high_risk = HealthDataAnonymized.query.filter(
                HealthDataAnonymized.BMI >= min_bmi,
                HealthDataAnonymized.BMI < max_bmi,
                HealthDataAnonymized.risk == 1
            ).count()
            
            risk_ratio = round((high_risk / total) * 100, 2) if total > 0 else 0

            result.append({
                "label": label,
                "total": total,
                "high_risk": high_risk,
                "risk_ratio": risk_ratio
            })

        return jsonify({
            "status": "success",
            "data": result
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)