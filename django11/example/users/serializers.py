from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'timestamp', 'updated_at']        
        read_only_fields = ['timestamp', 'updated_at']
